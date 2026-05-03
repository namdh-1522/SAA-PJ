'use client'

import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import FormLabel from '@/components/kudos/compose/atoms/FormLabel'
import { createClient } from '@/lib/supabase/client'

const MAX_IMAGES = 5
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_MIME_PREFIXES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const STORAGE_BUCKET = 'kudos-images'

interface PendingUpload {
  /** Stable local id used as React key + as the cancel/remove handle. */
  readonly id: string
  /** Browser-side preview URL for the staged file. */
  readonly previewUrl: string
  /** Storage object path under the user's prefix; needed for delete. */
  pathInBucket: string | null
  /** Public URL once upload completes. Mirrors into `form.imageUrls`. */
  remoteUrl: string | null
  /** UI state. */
  status: 'uploading' | 'success' | 'error'
  errorKey?: 'image_too_large' | 'image_invalid_type' | 'image_max' | 'submit_failed'
}

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/webp') return 'webp'
  return 'bin'
}

export default function ImageUploadField() {
  const t = useTranslations('kudos.compose')
  const { form, setImages } = useKudoComposeContext()
  const [pending, setPending] = useState<readonly PendingUpload[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const totalCount = form.imageUrls.length + pending.filter((p) => p.status === 'uploading').length
  const reachedMax = totalCount >= MAX_IMAGES

  const updatePending = useCallback(
    (id: string, patch: Partial<PendingUpload>) => {
      setPending((cur) => cur.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    [],
  )

  const removePending = useCallback((id: string) => {
    setPending((cur) => {
      const target = cur.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return cur.filter((p) => p.id !== id)
    })
  }, [])

  const uploadOne = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID()
      const previewUrl = URL.createObjectURL(file)

      // Validate type + size before staging.
      if (!ACCEPTED_MIME_PREFIXES.includes(file.type)) {
        setPending((cur) => [
          ...cur,
          { id, previewUrl, pathInBucket: null, remoteUrl: null, status: 'error', errorKey: 'image_invalid_type' },
        ])
        return
      }
      if (file.size > MAX_BYTES) {
        setPending((cur) => [
          ...cur,
          { id, previewUrl, pathInBucket: null, remoteUrl: null, status: 'error', errorKey: 'image_too_large' },
        ])
        return
      }

      setPending((cur) => [
        ...cur,
        { id, previewUrl, pathInBucket: null, remoteUrl: null, status: 'uploading' },
      ])

      // Resolve auth user → upload prefix.
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()
      if (userErr || !user) {
        updatePending(id, { status: 'error', errorKey: 'submit_failed' })
        return
      }

      const ext = extFromMime(file.type)
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          cacheControl: '31536000',
          contentType: file.type,
          upsert: false,
        })
      if (uploadErr) {
        updatePending(id, { status: 'error', errorKey: 'submit_failed' })
        return
      }

      const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
      const remoteUrl = publicUrlData.publicUrl

      updatePending(id, { status: 'success', pathInBucket: path, remoteUrl })

      // Promote to the form's authoritative list. Read latest via the snapshot
      // captured by setImages; this avoids stale-closure bugs when several
      // uploads finish in parallel.
      setImages([...form.imageUrls, remoteUrl] as readonly string[])
    },
    [supabase, updatePending, setImages, form.imageUrls],
  )

  const handleFiles = useCallback(
    (filesList: FileList | null) => {
      if (!filesList || filesList.length === 0) return
      const remainingSlots = MAX_IMAGES - totalCount
      const files = Array.from(filesList).slice(0, remainingSlots)
      // Reset the input so selecting the same file again still triggers `change`.
      if (fileInputRef.current) fileInputRef.current.value = ''
      files.forEach(uploadOne)
    },
    [totalCount, uploadOne],
  )

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files),
    [handleFiles],
  )

  const removeUploaded = useCallback(
    async (url: string) => {
      // Keep the form authoritative — drop the URL synchronously so the
      // submit button enables/disables correctly even if the storage delete
      // is slow or fails.
      const next = form.imageUrls.filter((u) => u !== url)
      setImages(next)
      // Best-effort delete from storage. Find the matching pending entry to
      // resolve the path; if the user pasted an arbitrary URL we have no
      // path and skip (RLS would reject anyway).
      const target = pending.find((p) => p.remoteUrl === url && p.pathInBucket)
      if (target?.pathInBucket) {
        await supabase.storage.from(STORAGE_BUCKET).remove([target.pathInBucket])
      }
      // Drop from local pending too so the thumbnail disappears.
      setPending((cur) =>
        cur.filter((p) => {
          if (p.remoteUrl === url) {
            URL.revokeObjectURL(p.previewUrl)
            return false
          }
          return true
        }),
      )
    },
    [form.imageUrls, setImages, pending, supabase],
  )

  // Combine uploaded URLs (no local preview) + pending entries for display.
  // Pending entries with `remoteUrl` already in form.imageUrls are dedup'd
  // so we don't show the thumbnail twice.
  const displayPending = pending.filter(
    (p) => p.remoteUrl == null || !form.imageUrls.includes(p.remoteUrl),
  )

  return (
    <div className="flex w-full flex-col gap-[8px]">
      <div className="flex flex-row items-center gap-[16px]">
        <div className="w-[108px] flex-shrink-0">
          <FormLabel>{t('fields.image_label')}</FormLabel>
        </div>
        <div className="flex flex-1 flex-row flex-wrap items-center gap-[12px]">
          {/* Thumbnails — already-uploaded URLs. */}
          {form.imageUrls.map((url) => (
            <div
              key={url}
              className="relative h-[64px] w-[64px] overflow-hidden rounded-[8px]"
              style={{ border: '1px solid var(--color-kudos-compose-border)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <button
                type="button"
                onClick={() => removeUploaded(url)}
                aria-label={t('actions.cancel')}
                className="absolute right-[4px] top-[4px] flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full text-[12px] font-bold leading-none"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Pending thumbnails — uploading or errored. */}
          {displayPending.map((p) => (
            <div
              key={p.id}
              className="relative h-[64px] w-[64px] overflow-hidden rounded-[8px]"
              style={{
                border:
                  p.status === 'error'
                    ? '1px solid var(--color-kudos-compose-required)'
                    : '1px solid var(--color-kudos-compose-border)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.previewUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ opacity: p.status === 'uploading' ? 0.5 : 1 }}
              />
              {p.status === 'uploading' && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    color: '#FFFFFF',
                  }}
                  aria-live="polite"
                >
                  {t('loading.uploading_image')}
                </div>
              )}
              <button
                type="button"
                onClick={() => removePending(p.id)}
                aria-label={t('actions.cancel')}
                className="absolute right-[4px] top-[4px] flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full text-[12px] font-bold leading-none"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add trigger. Hidden until the user is below the cap. */}
          {!reachedMax && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_MIME_PREFIXES.join(',')}
                multiple
                onChange={onInputChange}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex cursor-pointer flex-col items-center justify-center gap-[2px] px-[16px] py-[6px] transition-colors hover:bg-[rgba(255,234,158,0.15)]"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-kudos-compose-border)',
                  borderRadius: '8px',
                  color: 'var(--color-kudos-compose-text)',
                }}
              >
                <span className="text-[14px] font-bold leading-[20px]">
                  {t('fields.image_add')}
                </span>
                <span
                  className="text-[12px] font-medium leading-[16px]"
                  style={{ color: 'var(--color-kudos-compose-text-secondary)' }}
                >
                  {t('fields.image_max')}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Per-file error messages. */}
      {displayPending
        .filter((p) => p.status === 'error' && p.errorKey)
        .map((p) => (
          <p
            key={`err-${p.id}`}
            className="pl-[124px] text-[14px] leading-[20px]"
            style={{ color: 'var(--color-kudos-compose-required)' }}
          >
            {t(`errors.${p.errorKey!}` as 'errors.image_too_large')}
          </p>
        ))}
    </div>
  )
}

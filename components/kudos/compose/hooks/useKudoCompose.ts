'use client'

import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { KudosCreateBodySchema } from '@/lib/kudos/schemas'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'

interface UseKudoComposeReturn {
  submit: () => Promise<void>
  isSubmitting: boolean
  isValid: boolean
  submitError: string | null
}

export function useKudoCompose(): UseKudoComposeReturn {
  const { form, setErrors, close } = useKudoComposeContext()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Mirror Zod validity into a derived flag for the Gửi button enable-disable logic.
  const validation = KudosCreateBodySchema.safeParse(form)
  const isValid = validation.success

  const submit = useCallback(async () => {
    const parsed = KudosCreateBodySchema.safeParse(form)
    if (!parsed.success) {
      // Map issues to field-level errors keyed by their first path segment.
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (typeof path === 'string' && !errors[path]) {
          errors[path] = issue.message
        }
      }
      setErrors(errors)
      // Surface a top-level banner (Figma `5c7PkAibyD`): the user clicked Gửi
      // without filling all required fields. The banner copy enumerates the
      // canonical "you need X, Y, Z" list — mirroring the Vietnamese
      // "Bạn cần điền đủ Người nhận, Lời nhắn gửi và Hashtag để gửi Kudos!"
      setSubmitError('missing_required_fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? `Request failed with ${res.status}`)
      }

      // Drain the response body to free the stream; the id isn't needed locally.
      await res.json()

      // Invalidate caches so the new Kudo appears on the Live Board.
      await queryClient.invalidateQueries({ queryKey: ['kudos-feed'] })
      await queryClient.invalidateQueries({ queryKey: ['kudos-stats'] })
      await queryClient.invalidateQueries({ queryKey: ['kudos-total'] })

      close()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'submit_failed')
    } finally {
      setIsSubmitting(false)
    }
  }, [form, setErrors, queryClient, close])

  return { submit, isSubmitting, isValid, submitError }
}

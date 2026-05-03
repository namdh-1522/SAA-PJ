'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'
import RecipientField from '@/components/kudos/compose/fields/RecipientField'
import DanhHieuField from '@/components/kudos/compose/fields/DanhHieuField'
import RichTextEditor from '@/components/kudos/compose/fields/RichTextEditor'
import HashtagField from '@/components/kudos/compose/fields/HashtagField'
import ImageUploadField from '@/components/kudos/compose/fields/ImageUploadField'
import AnonymousField from '@/components/kudos/compose/fields/AnonymousField'
import ActionsFooter from '@/components/kudos/compose/fields/ActionsFooter'

export default function KudoComposeModal() {
  const t = useTranslations('kudos.compose')
  const { isOpen, close } = useKudoComposeContext()

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 'var(--z-modal)',
          }}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none overflow-y-auto"
          style={{
            width: 'min(752px, calc(100vw - 32px))',
            maxHeight: 'calc(100vh - 32px)',
            padding: 'var(--spacing-kudos-compose-padding)',
            gap: 'var(--spacing-kudos-compose-gap)',
            background: 'var(--color-kudos-compose-modal-bg)',
            borderRadius: 'var(--radius-kudos-compose-modal)',
            zIndex: 'var(--z-modal)',
          }}
        >
          <div className="flex flex-col" style={{ gap: 'var(--spacing-kudos-compose-gap)' }}>
            <Dialog.Title
              className="font-bold text-center"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 'var(--text-kudos-compose-title-size)',
                fontWeight: 'var(--text-kudos-compose-title-weight)',
                lineHeight: 'var(--text-kudos-compose-title-lh)',
                color: 'var(--color-kudos-compose-text)',
              }}
            >
              {t('modal_title')}
            </Dialog.Title>

            <RecipientField />
            <DanhHieuField />

            {/* Content frame — Figma `Content` (672 × 444 px): editor + hashtag
                + image stacked with the 24 px section-gap. The Anonymous
                checkbox (G) and Footer (H) are siblings of this block per the
                Figma layout, NOT children of it. */}
            <div
              className="flex flex-col"
              style={{ gap: 'var(--spacing-kudos-compose-section-gap)' }}
            >
              <RichTextEditor />
              <HashtagField />
              <ImageUploadField />
            </div>

            <AnonymousField />
            <ActionsFooter />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

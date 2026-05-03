import AvatarHoverPreview from '@/components/kudos/shared/AvatarHoverPreview'
import UserInfoBlock from '@/components/kudos/shared/UserInfoBlock'
import ArrowSentIcon from '@/components/icons/arrow-sent-icon'
import type { KudosUser } from '@/types/kudos'

interface KudosPostHeaderProps {
  sender: KudosUser
  receiver: KudosUser
}

/**
 * C.3 KUDO Post header — Figma node `I3127:21871;256:4857` ("Info user").
 *
 * Layout (per Figma):
 *   - flex-row, gap 24, alignItems flex-start, justifyContent space-between
 *   - Sender column (avatar 64 on top, name+dept centered below)
 *   - Arrow icon (centered vertically via padding)
 *   - Receiver column (avatar 64 on top, name+dept centered below)
 *
 * The timestamp lives in the content frame BELOW the gold divider — NOT in
 * this header — so it's no longer a prop here.
 */
export default function KudosPostHeader({ sender, receiver }: KudosPostHeaderProps) {
  return (
    <div className="flex w-full items-start justify-between gap-6">
      <div className="flex min-w-0 flex-1 justify-center">
        <AvatarHoverPreview user={sender}>
          <UserInfoBlock user={sender} showDept size="lg" layout="column" />
        </AvatarHoverPreview>
      </div>

      <div className="flex h-[123px] flex-shrink-0 items-center">
        <ArrowSentIcon
          width={32}
          height={32}
          className="text-[var(--color-cta-bg)]"
        />
      </div>

      <div className="flex min-w-0 flex-1 justify-center">
        <AvatarHoverPreview user={receiver}>
          <UserInfoBlock user={receiver} showDept size="lg" layout="column" />
        </AvatarHoverPreview>
      </div>
    </div>
  )
}

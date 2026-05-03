import LanguageSelector from './language-selector'
import NotificationButton from './notification-button'
import AvatarMenu from './avatar-menu'

export interface HeaderControlsProps {
  isAdmin: boolean
  userEmail?: string
}

export default function HeaderControls({ isAdmin, userEmail }: HeaderControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <LanguageSelector />
      <NotificationButton />
      <AvatarMenu isAdmin={isAdmin} userEmail={userEmail} />
    </div>
  )
}

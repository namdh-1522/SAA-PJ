import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EventInfo from '@/components/home/event-info'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
  useLocale: () => 'vi',
}))

describe('EventInfo', () => {
  it('falls back to i18n date_value when no eventStartISO', () => {
    render(<EventInfo eventStartISO={undefined} />)
    expect(screen.getByText('home.event.time_label')).toBeInTheDocument()
    expect(screen.getByText('home.event.date_value')).toBeInTheDocument()
  })

  it('formats eventStartISO using locale + Asia/Ho_Chi_Minh timezone', () => {
    render(<EventInfo eventStartISO="2026-07-07T18:30:00+07:00" />)
    // vi locale → dd/MM/yyyy, formatted in event timezone so the date stays 07/07/2026
    // regardless of the test machine's timezone.
    expect(screen.getByText('07/07/2026')).toBeInTheDocument()
  })

  it('renders location label + value', () => {
    render(<EventInfo eventStartISO={undefined} />)
    expect(screen.getByText('home.event.location_label')).toBeInTheDocument()
    expect(screen.getByText('home.event.location_value')).toBeInTheDocument()
  })

  it('renders livestream note', () => {
    render(<EventInfo eventStartISO={undefined} />)
    expect(screen.getByText('home.event.livestream_note')).toBeInTheDocument()
  })
})

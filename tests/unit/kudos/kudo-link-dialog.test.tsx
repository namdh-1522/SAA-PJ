/**
 * Unit tests for <KudoLinkDialog> — Figma `OyDLDuSGEa`.
 *
 * Covers: render with seeded values, save with valid URL, save disabled when
 * URL empty, invalid URL surface, cancel.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import KudoLinkDialog from '@/components/kudos/compose/fields/KudoLinkDialog'

const messages = {
  kudos: {
    compose: {
      fields: {
        link_dialog_title: 'Thêm đường dẫn',
        link_dialog_content_label: 'Nội dung',
        link_dialog_content_placeholder: 'Nội dung hiển thị',
        link_dialog_url_label: 'URL',
        link_dialog_url_placeholder: 'https://',
        link_dialog_url_invalid: 'URL không hợp lệ',
        link_dialog_cancel: 'Hủy',
        link_dialog_save: 'Lưu',
      },
    },
  },
}

interface RenderOpts {
  initialContent?: string
  initialUrl?: string
}

function renderDialog(opts: RenderOpts = {}) {
  const onSave = vi.fn()
  const onOpenChange = vi.fn()
  const utils = render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <KudoLinkDialog
        open={true}
        onOpenChange={onOpenChange}
        initialContent={opts.initialContent ?? ''}
        initialUrl={opts.initialUrl ?? 'https://'}
        onSave={onSave}
      />
    </NextIntlClientProvider>,
  )
  return { onSave, onOpenChange, ...utils }
}

describe('<KudoLinkDialog>', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the title and both fields', () => {
    renderDialog({ initialContent: 'click here', initialUrl: 'https://example.com' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Thêm đường dẫn')).toBeInTheDocument()
    const contentInput = screen.getByLabelText('Nội dung') as HTMLInputElement
    const urlInput = screen.getByLabelText('URL') as HTMLInputElement
    expect(contentInput.value).toBe('click here')
    expect(urlInput.value).toBe('https://example.com')
  })

  it('disables Save when URL is empty', () => {
    renderDialog({ initialUrl: '' })
    const save = screen.getByRole('button', { name: /Lưu/ })
    expect(save).toBeDisabled()
  })

  it('calls onSave with trimmed values when URL is valid', () => {
    const { onSave, onOpenChange } = renderDialog({ initialUrl: '' })
    fireEvent.change(screen.getByLabelText('Nội dung'), { target: { value: '  link text  ' } })
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: '  https://example.com  ' } })
    fireEvent.click(screen.getByRole('button', { name: /Lưu/ }))
    expect(onSave).toHaveBeenCalledWith({ content: 'link text', url: 'https://example.com' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows an inline error and does NOT call onSave when URL fails the allow-list', () => {
    const { onSave, onOpenChange } = renderDialog({ initialUrl: '' })
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'javascript:alert(1)' } })
    fireEvent.click(screen.getByRole('button', { name: /Lưu/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('URL không hợp lệ')
    expect(onSave).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })

  it('clears the URL error as soon as the user edits the URL again', () => {
    renderDialog({ initialUrl: '' })
    const urlInput = screen.getByLabelText('URL')
    fireEvent.change(urlInput, { target: { value: 'javascript:bad' } })
    fireEvent.click(screen.getByRole('button', { name: /Lưu/ }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    fireEvent.change(urlInput, { target: { value: 'https://ok.example' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when Hủy is clicked, without calling onSave', () => {
    const { onSave, onOpenChange } = renderDialog({ initialUrl: 'https://x.test' })
    fireEvent.click(screen.getByRole('button', { name: /Hủy/ }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSave).not.toHaveBeenCalled()
  })
})

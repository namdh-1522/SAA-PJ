/**
 * Unit tests for <KudosHashtagDropdown> — Figma `JWpsISMAaM`.
 *
 * Covers: rendering of trigger + label, opening/closing on click, selection
 * callback, Esc dismissal, a11y attributes, and the `#`-prefixed row labels.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import KudosHashtagDropdown from '@/components/kudos/highlight/KudosHashtagDropdown'
import type { Hashtag } from '@/types/kudos'

const messages = {
  kudos: {
    highlight: {
      filter_all_hashtags: 'Tất cả hashtag',
      filter_hashtag_label: 'Hashtag',
    },
  },
}

const hashtags: Hashtag[] = [
  { id: 'h1', name: 'Dedicated', usageCount: 12 },
  { id: 'h2', name: 'Inspring',  usageCount: 7  },
  { id: 'h3', name: 'TeamWork',  usageCount: 3  },
]

function renderDropdown(value: string | null = null, onChange = vi.fn()) {
  return {
    onChange,
    ...render(
      <NextIntlClientProvider locale="vi" messages={messages}>
        <KudosHashtagDropdown
          hashtags={hashtags}
          value={value}
          onChange={onChange}
        />
      </NextIntlClientProvider>
    ),
  }
}

describe('<KudosHashtagDropdown>', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the trigger with the "All hashtags" label when value is null', () => {
    renderDropdown(null)
    const trigger = screen.getByRole('combobox', { name: /Hashtag/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Tất cả hashtag')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders the trigger with the active "#name" label when value matches a hashtag', () => {
    renderDropdown('Dedicated')
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('#Dedicated')
  })

  it('opens the panel on trigger click and exposes role="listbox"', () => {
    renderDropdown(null)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
    // Includes synthetic "All" option + 3 hashtags = 4 options
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('renders each hashtag row with a leading "#" prefix', () => {
    renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: '#Dedicated' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '#Inspring'  })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '#TeamWork'  })).toBeInTheDocument()
  })

  it('marks the active option with aria-selected="true"', () => {
    renderDropdown('Inspring')
    fireEvent.click(screen.getByRole('combobox'))
    const active = screen.getByRole('option', { name: '#Inspring' })
    expect(active).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: '#Dedicated' })).toHaveAttribute(
      'aria-selected', 'false',
    )
  })

  it('calls onChange with the hashtag name (no "#") when an item is clicked', () => {
    const { onChange } = renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: '#TeamWork' }))
    expect(onChange).toHaveBeenCalledWith('TeamWork')
  })

  it('calls onChange(null) when "Tất cả hashtag" is clicked', () => {
    const { onChange } = renderDropdown('Dedicated')
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Tất cả hashtag' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('closes the panel after selection', () => {
    renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: '#Dedicated' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes the panel when Escape is pressed', () => {
    renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

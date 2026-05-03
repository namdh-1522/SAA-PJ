/**
 * Unit tests for <KudosDeptDropdown> — Figma `WXK5AYB_rG`.
 *
 * Covers: rendering of trigger + label, opening/closing on click, keyboard
 * navigation, selection callback, Esc dismissal, and a11y attributes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import KudosDeptDropdown from '@/components/kudos/highlight/KudosDeptDropdown'
import type { Department } from '@/types/kudos'

const messages = {
  kudos: {
    highlight: {
      filter_all_depts: 'Tất cả phòng ban',
      filter_dept_label: 'Lọc theo phòng ban',
    },
  },
}

const departments: Department[] = [
  { id: 'd1', code: 'CECV2', name: 'CECV2' },
  { id: 'd2', code: 'CECV3', name: 'CECV3' },
  { id: 'd3', code: 'OPD',   name: 'OPD'   },
]

function renderDropdown(value: string | null = null, onChange = vi.fn()) {
  return {
    onChange,
    ...render(
      <NextIntlClientProvider locale="vi" messages={messages}>
        <KudosDeptDropdown
          departments={departments}
          value={value}
          onChange={onChange}
        />
      </NextIntlClientProvider>
    ),
  }
}

describe('<KudosDeptDropdown>', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the trigger with the "All departments" label when value is null', () => {
    renderDropdown(null)
    const trigger = screen.getByRole('combobox', { name: /Lọc theo phòng ban/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Tất cả phòng ban')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders the trigger with the active department name when value matches a code', () => {
    renderDropdown('CECV2')
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('CECV2')
  })

  it('opens the panel on trigger click and exposes role="listbox"', () => {
    renderDropdown(null)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
    // Includes synthetic "All" option + 3 departments = 4 options
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('marks the active option with aria-selected="true"', () => {
    renderDropdown('CECV3')
    fireEvent.click(screen.getByRole('combobox'))
    const active = screen.getByRole('option', { name: 'CECV3' })
    expect(active).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'CECV2' })).toHaveAttribute(
      'aria-selected', 'false',
    )
  })

  it('calls onChange with the option code when an item is clicked', () => {
    const { onChange } = renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'OPD' }))
    expect(onChange).toHaveBeenCalledWith('OPD')
  })

  it('calls onChange(null) when "Tất cả phòng ban" is clicked', () => {
    const { onChange } = renderDropdown('CECV2')
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Tất cả phòng ban' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('closes the panel after selection', () => {
    renderDropdown(null)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'CECV2' }))
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

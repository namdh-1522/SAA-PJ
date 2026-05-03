'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackLabel?: string
}

interface State {
  hasError: boolean
}

export default class KudosSectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center gap-[12px] py-[32px] px-[24px] rounded-[var(--radius-kudos-card)] text-center"
          style={{ border: '1px solid var(--color-status-unread)', background: 'rgba(212,39,29,0.06)' }}
          role="alert"
        >
          <p className="text-[16px] font-bold" style={{ color: 'var(--color-status-unread)' }}>
            {this.props.fallbackLabel ?? 'Không thể tải dữ liệu'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="text-[14px] font-bold px-[16px] py-[8px] rounded-[8px]"
            style={{ background: 'var(--color-cta-bg)', color: 'var(--color-cta-text)' }}
          >
            Thử lại
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

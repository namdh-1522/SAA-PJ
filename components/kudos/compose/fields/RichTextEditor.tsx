'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import KudoLinkDialog from '@/components/kudos/compose/fields/KudoLinkDialog'
import MentionPopover, {
  type MentionCandidate,
  type MentionPopoverPosition,
} from '@/components/kudos/compose/fields/MentionPopover'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'

const MAX_CONTENT = 2000

type ToolbarAriaKey =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'numbered_list'
  | 'link'
  | 'quote'

type ToolbarKind =
  | { readonly kind: 'inline'; readonly command: 'bold' | 'italic' | 'strikeThrough' }
  | { readonly kind: 'list' }
  | { readonly kind: 'link' }
  | { readonly kind: 'quote' }

interface ToolbarAction {
  readonly id: ToolbarAriaKey
  readonly ariaLabelKey: ToolbarAriaKey
  /** Visual label — letter for the inline ones (B/I/S), inline SVG icon for the rest. */
  readonly label: ReactNode
  readonly kind: ToolbarKind
  /** Optional inline-style hint that mirrors the button's effect on its own letter. */
  readonly visualStyle?: React.CSSProperties
}

// Inline SVG icons. All 14×14, currentColor strokes — they inherit the button's
// text colour so we don't need to maintain extra colour tokens.
const NumberedListIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
)

const LinkIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const QuoteIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
)

const TOOLBAR_ACTIONS: readonly ToolbarAction[] = [
  { id: 'bold', ariaLabelKey: 'bold', label: 'B', kind: { kind: 'inline', command: 'bold' } },
  { id: 'italic', ariaLabelKey: 'italic', label: 'I', kind: { kind: 'inline', command: 'italic' }, visualStyle: { fontStyle: 'italic' } },
  { id: 'strikethrough', ariaLabelKey: 'strikethrough', label: 'S', kind: { kind: 'inline', command: 'strikeThrough' }, visualStyle: { textDecoration: 'line-through' } },
  { id: 'numbered_list', ariaLabelKey: 'numbered_list', label: NumberedListIcon, kind: { kind: 'list' } },
  { id: 'link', ariaLabelKey: 'link', label: LinkIcon, kind: { kind: 'link' } },
  { id: 'quote', ariaLabelKey: 'quote', label: QuoteIcon, kind: { kind: 'quote' } },
] as const

interface LinkDialogState {
  open: boolean
  selectedText: string
  savedRange: Range | null
}

const CLOSED_LINK_DIALOG: LinkDialogState = {
  open: false,
  selectedText: '',
  savedRange: null,
}

interface MentionState {
  /** Length (in chars) of the query AFTER `@`. The trigger spans `query.length + 1`. */
  readonly query: string
  /** Caret position info for anchoring the popover relative to the editor. */
  readonly position: MentionPopoverPosition
}

/**
 * Walks back from the caret to find an active `@trigger` — i.e. an `@` with
 * no whitespace between it and the caret, in the same text node, that's not
 * a substring of an email address. Returns the query text after the `@` plus
 * the DOM offset of the `@` itself, or `null` if the caret isn't inside a
 * mention context.
 */
function readMentionTrigger(): {
  query: string
  triggerNode: Text
  triggerOffset: number
} | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  const range = sel.getRangeAt(0)
  if (!range.collapsed) return null
  const node = range.endContainer
  if (node.nodeType !== Node.TEXT_NODE) return null
  const text = node.textContent ?? ''
  const offset = range.endOffset
  // Walk backwards until we hit `@` or whitespace / start of node.
  let i = offset - 1
  while (i >= 0) {
    const ch = text[i]
    if (ch === '@') {
      // Treat as mention only if the char before `@` is whitespace, start of
      // node, or absent. This avoids hijacking `email@domain` strings.
      const prev = i > 0 ? text[i - 1] : ''
      if (i === 0 || /\s/.test(prev)) {
        return {
          query: text.slice(i + 1, offset),
          triggerNode: node as Text,
          triggerOffset: i,
        }
      }
      return null
    }
    if (/\s/.test(ch)) return null
    i--
  }
  return null
}

export default function RichTextEditor() {
  const id = useId()
  const t = useTranslations('kudos.compose')
  const { form, setField, errors } = useKudoComposeContext()
  const error = errors.content
  const editorRef = useRef<HTMLDivElement>(null)
  const [textLen, setTextLen] = useState(0)
  const [linkDialog, setLinkDialog] = useState<LinkDialogState>(CLOSED_LINK_DIALOG)
  const [mention, setMention] = useState<MentionState | null>(null)

  // Reset editor's DOM only when the form is reset externally (e.g. after submit/cancel).
  // We MUST NOT mirror `form.content` back into the DOM on every keystroke — that would
  // wipe the live selection and cursor position while the user is typing.
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (form.content === '' && el.innerHTML !== '') {
      el.innerHTML = ''
      setTextLen(0)
    }
  }, [form.content])

  const refreshMentionState = useCallback(() => {
    const el = editorRef.current
    if (!el) {
      setMention(null)
      return
    }
    const trigger = readMentionTrigger()
    if (!trigger) {
      setMention(null)
      return
    }
    // Anchor the popover to the caret. `getBoundingClientRect()` on a
    // collapsed Range can return an empty rect in some browsers, so we read
    // a non-collapsed range that spans the `@` to the caret as a fallback.
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      setMention(null)
      return
    }
    const caretRange = sel.getRangeAt(0).cloneRange()
    let rect = caretRange.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      const anchorRange = document.createRange()
      anchorRange.setStart(trigger.triggerNode, trigger.triggerOffset)
      anchorRange.setEnd(caretRange.endContainer, caretRange.endOffset)
      rect = anchorRange.getBoundingClientRect()
    }
    const editorRect = el.getBoundingClientRect()
    setMention({
      query: trigger.query,
      position: {
        left: rect.left - editorRect.left + el.scrollLeft,
        top: rect.top - editorRect.top + el.scrollTop,
        lineHeight: rect.height || 20,
      },
    })
  }, [])

  const handleInput = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    setTextLen(el.textContent?.length ?? 0)
    setField('content', el.innerHTML)
    refreshMentionState()
  }, [setField, refreshMentionState])

  // Refresh on caret moves that don't fire `input` (arrow keys, mouse clicks)
  // — without this, clicking back into a `@text` token doesn't reopen the
  // popover.
  useEffect(() => {
    function onSelectionChange() {
      const el = editorRef.current
      if (!el) return
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const node = sel.getRangeAt(0).endContainer
      if (!el.contains(node)) return
      refreshMentionState()
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [refreshMentionState])

  const handleMentionSelect = useCallback(
    (sunner: MentionCandidate) => {
      const el = editorRef.current
      if (!el) return
      const trigger = readMentionTrigger()
      if (!trigger) {
        setMention(null)
        return
      }
      // Replace the `@query` slice with `@FullName ` (trailing space so the
      // user keeps typing fluently after the mention).
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const caretRange = sel.getRangeAt(0)
      const replaceRange = document.createRange()
      replaceRange.setStart(trigger.triggerNode, trigger.triggerOffset)
      replaceRange.setEnd(caretRange.endContainer, caretRange.endOffset)
      sel.removeAllRanges()
      sel.addRange(replaceRange)
      // execCommand keeps the undo stack consistent with the rest of the
      // toolbar actions, which all funnel through it.
      document.execCommand('insertText', false, `@${sunner.name} `)
      setMention(null)
      handleInput()
    },
    [handleInput],
  )

  const applyAction = useCallback(
    (kind: ToolbarKind) => {
      const el = editorRef.current
      if (!el) return
      el.focus()
      // execCommand is technically deprecated but is the only zero-dependency
      // mechanism for inline formatting on a contentEditable region that
      // ships with every browser today. Constitution §II forbids unapproved
      // 3rd-party deps, so we use this until Tiptap is approved.
      switch (kind.kind) {
        case 'inline':
          document.execCommand(kind.command, false)
          break
        case 'list':
          document.execCommand('insertOrderedList', false)
          break
        case 'quote':
          // Chromium-based browsers (and historically Safari) require the angle
          // brackets here; Firefox accepts either. Use the bracketed form so
          // the tag actually wraps in every supported browser.
          document.execCommand('formatBlock', false, '<blockquote>')
          break
        case 'link': {
          // Snapshot the selection BEFORE the styled dialog opens — the modal
          // steals focus and many browsers collapse the editor's selection
          // while it's up. We restore the range on Save so the insert happens
          // at the right place.
          const selection = window.getSelection()
          const savedRange =
            selection && selection.rangeCount > 0
              ? selection.getRangeAt(0).cloneRange()
              : null
          const selectedText = selection?.toString() ?? ''
          setLinkDialog({ open: true, selectedText, savedRange })
          // Skip the trailing handleInput() — the dialog hasn't applied a
          // change yet; that runs on Save.
          return
        }
      }
      handleInput()
    },
    [handleInput],
  )

  const handleLinkSave = useCallback(
    ({ content, url }: { content: string; url: string }) => {
      const el = editorRef.current
      if (!el) return
      // Restore the saved selection inside the editor before running
      // execCommand — same trick the previous prompt-based flow used.
      const selection = window.getSelection()
      el.focus()
      if (linkDialog.savedRange && selection) {
        selection.removeAllRanges()
        selection.addRange(linkDialog.savedRange)
      }

      const hasSelection = linkDialog.selectedText.length > 0
      const safeUrl = url.replace(/"/g, '&quot;')
      const visible = (content || url).replace(/[<>&]/g, (ch) =>
        ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : '&amp;',
      )

      if (hasSelection && !content) {
        // User wanted the existing selection to become the link text.
        document.execCommand('createLink', false, url)
      } else {
        // Either there was no selection, or the user typed display text in
        // the dialog — insert a fresh <a> with that label (overrides the
        // previous selection if any).
        document.execCommand(
          'insertHTML',
          false,
          `<a href="${safeUrl}" rel="noopener noreferrer" target="_blank">${visible}</a>`,
        )
      }
      handleInput()
    },
    [handleInput, linkDialog.savedRange, linkDialog.selectedText],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Standard formatting shortcuts so power users don't have to mouse to the toolbar.
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod) return
      const key = e.key.toLowerCase()
      if (key === 'b') {
        e.preventDefault()
        applyAction({ kind: 'inline', command: 'bold' })
      } else if (key === 'i') {
        e.preventDefault()
        applyAction({ kind: 'inline', command: 'italic' })
      }
    },
    [applyAction],
  )

  // Hard-cap typed content at MAX_CONTENT. We let the user paste/format above
  // the limit but we surface a red counter; the actual block happens here on
  // beforeinput so we don't fight with execCommand-driven changes.
  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLDivElement> & { data?: string }) => {
      const el = editorRef.current
      if (!el) return
      const currentLen = el.textContent?.length ?? 0
      const native = (e.nativeEvent as unknown as { inputType?: string; data?: string }) ?? {}
      // Only block if the operation would *grow* the text — deletes, formatting,
      // selection ops (insertParagraph, formatBold, etc.) must always pass.
      const inserted = (native.data ?? e.data ?? '').toString()
      if (!inserted) return
      if (currentLen + inserted.length > MAX_CONTENT) {
        e.preventDefault()
      }
    },
    [],
  )

  const overLimit = textLen > MAX_CONTENT

  return (
    <div className="flex w-full flex-col gap-[4px]">
      {/* Toolbar — Bold / Italic / Strikethrough / Numbered list / Link / Quote.
          Mirrors the Figma C.1–C.6 toolbar group on the Viết Kudo modal. */}
      <div
        role="toolbar"
        aria-label={t('fields.toolbar_label')}
        className="flex h-[40px] flex-row items-center select-none"
        style={{
          border: '1px solid var(--color-kudos-compose-border)',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          background: 'transparent',
        }}
      >
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={t(`fields.toolbar_${action.ariaLabelKey}` as 'fields.toolbar_bold')}
            onMouseDown={(e) => {
              // Prevent the contentEditable from losing the user's selection
              // when the toolbar button steals focus.
              e.preventDefault()
            }}
            onClick={() => applyAction(action.kind)}
            className="flex h-[40px] cursor-pointer items-center justify-center px-[16px] py-[10px] font-bold transition-colors hover:bg-[rgba(255,234,158,0.15)]"
            style={{
              borderRight: '1px solid var(--color-kudos-compose-border)',
              color: 'var(--color-kudos-compose-text)',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '14px',
              ...action.visualStyle,
            }}
          >
            {action.label}
          </button>
        ))}
        {/* Spec FR-017 — opens in a new tab so the in-progress draft survives. */}
        <a
          href="/community-standards"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto cursor-pointer pr-[16px] pl-[16px] font-bold underline transition-opacity hover:opacity-80"
          style={{
            color: 'var(--color-kudos-compose-required)',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '14px',
          }}
        >
          {t('fields.community_standards')}
        </a>
      </div>

      {/* Editor surface — contentEditable so execCommand can apply formatting.
          Wrapped in a `relative` parent so `<MentionPopover>` can position
          itself absolutely to the caret without escaping the modal. */}
      <div className="relative">
      <div
        id={id}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={`${id}-hint ${error ? `${id}-error` : ''}`.trim()}
        data-placeholder={t('fields.content_placeholder')}
        onInput={handleInput}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        // Strip styles/markup from anything pasted in.
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="kudos-rich-content w-full overflow-auto outline-none transition-colors empty:before:pointer-events-none empty:before:text-[var(--color-kudos-compose-text-secondary)] empty:before:content-[attr(data-placeholder)]"
        style={{
          minHeight: '120px',
          height: '200px',
          paddingLeft: '24px',
          paddingTop: '16px',
          paddingRight: '24px',
          paddingBottom: '16px',
          background: 'var(--color-kudos-compose-input-bg)',
          border: error
            ? '1px solid var(--color-kudos-compose-required)'
            : '1px solid var(--color-kudos-compose-border)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          color: 'var(--color-kudos-compose-text)',
          fontFamily: 'var(--font-montserrat)',
          fontSize: 'var(--text-kudos-compose-body-size)',
          lineHeight: 'var(--text-kudos-compose-body-lh)',
        }}
      />
      {mention && (
        <MentionPopover
          query={mention.query}
          position={mention.position}
          onSelect={handleMentionSelect}
          onDismiss={() => setMention(null)}
        />
      )}
      </div>

      <div
        id={`${id}-hint`}
        className="flex flex-row items-center justify-between gap-[16px]"
      >
        <span
          className="font-bold"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-kudos-compose-body-size)',
            lineHeight: 'var(--text-kudos-compose-body-lh)',
            color: 'var(--color-kudos-compose-text-secondary)',
          }}
        >
          {error ? (
            <span id={`${id}-error`} style={{ color: 'var(--color-kudos-compose-required)' }}>
              {t(`errors.${error}` as 'errors.content_required')}
            </span>
          ) : (
            t('fields.content_hint')
          )}
        </span>
        <span
          className="font-medium"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '14px',
            color: overLimit
              ? 'var(--color-kudos-compose-required)'
              : 'var(--color-kudos-compose-text-secondary)',
          }}
        >
          {textLen}/{MAX_CONTENT}
        </span>
      </div>

      {/* Add link box — Figma `OyDLDuSGEa`. Stacked over the compose modal. */}
      <KudoLinkDialog
        open={linkDialog.open}
        onOpenChange={(open) =>
          setLinkDialog((prev) => (open ? prev : CLOSED_LINK_DIALOG))
        }
        initialContent={linkDialog.selectedText}
        onSave={handleLinkSave}
      />
    </div>
  )
}


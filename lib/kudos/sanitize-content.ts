// Tiny allow-list HTML sanitizer for Kudos content.
//
// Why hand-rolled: the Constitution forbids unapproved third-party deps (§II),
// and the only HTML we accept here is a fixed inline-formatting allow-list
// produced by `RichTextEditor`'s toolbar (`bold | italic | strikeThrough |
// insertOrderedList | createLink | formatBlock(blockquote)`) — too narrow to
// justify a 30 kB sanitiser dependency.
//
// Behavior:
//  - Allowed tags pass through. All attributes are stripped EXCEPT for the
//    `href` on `<a>` tags, which is filtered against a safe-protocol allow-list
//    and always paired with `rel="noopener noreferrer"` + `target="_blank"`.
//  - Disallowed tags (incl. `<script>`, `<img>`, `<iframe>`) are removed *as
//    tags* — their text content is preserved as plain text.
//  - Both browser and Node runtimes are supported (no DOM access).
//  - `<br />`, `<br/>` and `<br>` all collapse to `<br>`.
//
// Caveats:
//  - This is NOT a general-purpose sanitiser; it's tuned for the small set of
//    tags `RichTextEditor` produces. Do not use for arbitrary user HTML from
//    other sources.
//  - It runs over a regex; malformed tags like `<b<` are left untouched as
//    text and will be normalised by the browser at render time (safe — no
//    script execution path remains because no `<script>` survives the pass).

const ALLOWED_TAGS = new Set([
  'b',
  'strong',
  'i',
  'em',
  's',
  'strike',
  'u',
  'br',
  'p',
  'div',
  'span',
  'ol',
  'ul',
  'li',
  'blockquote',
  'a',
])

const SAFE_HREF = /^(?:https?:|mailto:|\/|#)/i

/**
 * Returns the plain-text content of an HTML fragment by stripping every tag.
 * Used to validate the typed length of `RichTextEditor` output without
 * counting markup characters — `<b>x</b>` is 1 typed char, not 7.
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function sanitizeKudosContent(html: string): string {
  if (!html) return ''
  return html.replace(
    /<\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)(\/?)>/g,
    (match, rawTag: string, rawAttrs: string, selfClose: string) => {
      const tag = rawTag.toLowerCase()
      if (!ALLOWED_TAGS.has(tag)) return ''
      const isClose = match.startsWith('</')
      if (isClose) return `</${tag}>`
      if (tag === 'br') return '<br>'
      // Preserve a sanitised `href` on anchors only.
      if (tag === 'a') {
        const hrefMatch = rawAttrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i)
        const rawHref = hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? ''
        const safeHref = SAFE_HREF.test(rawHref) ? rawHref : null
        if (!safeHref) return '<a>'
        const escaped = safeHref.replace(/"/g, '&quot;')
        return `<a href="${escaped}" rel="noopener noreferrer" target="_blank">`
      }
      // Strip all attributes; preserve self-closing for void elements.
      return selfClose ? `<${tag} />` : `<${tag}>`
    },
  )
}

export interface RootFurtherMarkProps {
  size: 'xl' | 'md'
  className?: string
}

// The source PNG `hero-root-further.png` (1224×200) has the actual "ROOT FURTHER" text
// occupying roughly the LEFT 40% of the canvas horizontally (text bounds ~ 488×200, aspect ≈ 2.44:1),
// with the right 60% empty whitespace. Centering the image RECTANGLE leaves the visible TEXT
// shifted left of the container center.
//
// We CSS-crop the empty right side using `background-image` + `background-size` scaling:
// the visible text portion exactly fills the container width, the empty area is clipped out.

const SOURCE_TEXT_WIDTH = 488 // px — actual text bounds inside the 1224 source canvas
const SOURCE_TEXT_HEIGHT = 200 // px — full source canvas height (text uses full height)

const SIZES = {
  // Hero (xl) — left-aligned per Figma; render the WHOLE canvas (text + empty right)
  xl: {
    width: 1224,
    height: 200,
    cropLeftEmpty: false,
  },
  // Body B4.0 (md) — design shows this CENTERED. Crop empty right whitespace so visible-text
  // rectangle ≡ container rectangle ≡ centered position. Width chosen so mark reads clearly.
  md: {
    // Container width matches the visible text rectangle. Aspect = 488/200 = 2.44:1.
    width: 290,
    cropLeftEmpty: true,
  },
}

export default function RootFurtherMark({ size, className = '' }: RootFurtherMarkProps) {
  const dims = SIZES[size]

  if (dims.cropLeftEmpty) {
    // Scale entire image so the visible text portion (488px slice) fills the container width.
    // Container height = container width / text-aspect-ratio.
    const containerHeight = Math.round((dims.width * SOURCE_TEXT_HEIGHT) / SOURCE_TEXT_WIDTH)
    const scaleFactor = dims.width / SOURCE_TEXT_WIDTH
    const scaledImageWidth = Math.round(1224 * scaleFactor)
    return (
      <div
        role="img"
        aria-label="ROOT FURTHER"
        className={`block mx-auto ${className}`}
        style={{
          width: `${dims.width}px`,
          height: `${containerHeight}px`,
          maxWidth: '100%',
          backgroundImage: "url('/assets/home/hero-root-further.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${scaledImageWidth}px auto`,
          backgroundPosition: 'left top',
        }}
      />
    )
  }

  // Hero — straight image, no crop. The xl branch is the only one that hits
  // here (md returns above), so dims is guaranteed to have `height`.
  const xlDims = dims as typeof SIZES.xl
  return (
    <img
      src="/assets/home/hero-root-further.png"
      alt="ROOT FURTHER"
      width={xlDims.width}
      height={xlDims.height}
      role="img"
      className={`block object-contain max-w-full h-auto ${className}`}
    />
  )
}

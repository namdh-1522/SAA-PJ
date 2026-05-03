import Image from 'next/image'

export default function KudosLogomark() {
  return (
    <div
      role="img"
      aria-label="Sun* Kudos logo"
      className="pointer-events-none select-none"
    >
      <Image
        src="/assets/home/kudos-logomark.png"
        alt=""
        width={364}
        height={72}
        className="w-auto h-auto max-w-full"
      />
    </div>
  )
}

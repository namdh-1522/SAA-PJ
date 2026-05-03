import { AWARDS } from '@/lib/awards'
import AwardCard from './award-card'

export default function AwardList() {
  return (
    <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-[60px] md:gap-y-16 lg:grid-cols-3 lg:gap-x-[60px] xl:gap-x-[108px] lg:gap-y-20">
      {AWARDS.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  )
}

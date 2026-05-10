import type { Train } from '../data/timetable'
import { TypeBadge } from './TypeBadge'
import { formatTime, formatRemain } from '../utils/formatTime'

interface TrainRowProps {
    train: Train
    remainMin: number
}

export const TrainRow = ({ train, remainMin }: TrainRowProps) => {
    const isP0 = train.platform === 0
    const platformLabel = isP0 ? '0番線' : '3・4番線'
    const platformClass = isP0
        ? 'bg-[rgba(232,112,58,0.2)] text-[#f5a07a]'
        : 'bg-[rgba(34,197,94,0.15)] text-[#7ec8a0]'

    return (
        <div className="flex items-center gap-2 px-3 py-[9px] rounded-[9px] bg-white/[0.04]">
            <span className={`text-[11px] font-medium w-[4.5rem] text-center py-[2px] rounded shrink-0 ${platformClass}`}>
                {platformLabel}
            </span>
            <span className="text-[18px] font-light text-white min-w-[46px] shrink-0">
                {formatTime(train.hour, train.minute)}
            </span>
            <TypeBadge trainType={train.trainType} />
            <span className="text-[11px] text-[#c8d6e8] flex-1">北綾瀬</span>
            <span className="text-[11px] font-medium text-[#8a9bb5] whitespace-nowrap">
                {formatRemain(remainMin)}後
            </span>
        </div>
    )
}

import type { TrainType } from '../data/timetable'

interface TypeBadgeProps {
    trainType: TrainType
}

const STYLES: Record<TrainType, string> = {
    '普通': 'bg-[#3a4a5a] text-[#c8d6e8]',
    '準急': 'bg-[#1a3a7a] text-[#90b8f0]',
    '急行': 'bg-[#7a1a1a] text-[#f09090]',
}

export const TypeBadge = ({ trainType }: TypeBadgeProps) => {
    return (
        <span className={`text-[10px] font-medium px-[7px] py-[2px] rounded whitespace-nowrap ${STYLES[trainType]}`}>
            {trainType}
        </span>
    )
}

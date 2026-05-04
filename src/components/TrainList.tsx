import type { Train } from '../data/timetable'
import { TrainRow } from './TrainRow'

interface TrainListProps {
    trains: Train[]
    nowMin: number
}

export const TrainList = ({ trains, nowMin }: TrainListProps) => {
    return (
        <div className="mt-1">
            <div className="text-[11px] font-medium text-[#c8d6e8] mb-[5px]">北綾瀬方面（5本）</div>
            <div className="flex flex-col gap-[5px]">
                {trains.map((train, i) => {
                    const remainMin = train.hour * 60 + train.minute - nowMin
                    return <TrainRow key={i} train={train} remainMin={remainMin} />
                })}
            </div>
        </div>
    )
}

import type { Train, Platform } from '../data/timetable'
import { TypeBadge } from './TypeBadge'
import { formatTime, formatRemain } from '../utils/formatTime'

interface TrackCardProps {
    platform: Platform
    train: Train | null
    remainMin: number | null
}

const isOrange = (platform: Platform) => platform === 0

export const TrackCard = ({ platform, train, remainMin }: TrackCardProps) => {
    const orange = isOrange(platform)

    const lineColor    = orange ? 'bg-[#e8703a]'                    : 'bg-[#22c55e]'
    const headerBg     = orange ? 'bg-[rgba(232,112,58,0.15)]'      : 'bg-[rgba(34,197,94,0.12)]'
    const dotColor     = orange ? 'bg-[#e8703a]'                    : 'bg-[#22c55e]'
    const trackColor   = orange ? 'text-[#f5a07a]'                  : 'text-[#7ec8a0]'
    const subColor     = orange ? 'text-[#8a5a40]'                  : 'text-[#3a7050]'
    const bodyBg       = orange ? 'bg-[rgba(10,8,6,0.85)]'          : 'bg-[rgba(6,10,8,0.85)]'

    const trackName = platform === 0 ? '0番線' : '3・4番線'
    const trackSub  = platform === 0 ? '綾瀬 ⇔ 北綾瀬 折り返し' : '千代田線 直通'
    const nextLabel = platform === 0 || train === null
        ? '次の列車'
        : `次の列車（${train.platform}番線）`

    return (
        <div className="flex rounded-[12px] overflow-hidden mb-[10px] border-[0.5px] border-white/[0.06]">
            {/* 左縦線 */}
            <div className={`w-[3px] shrink-0 ${lineColor}`} />

            <div className="flex-1 min-w-0">
                {/* カードヘッダー */}
                <div className={`flex items-center gap-2 px-3 py-[7px] ${headerBg}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                    <span className={`text-[12px] font-medium ${trackColor}`}>{trackName}</span>
                    <span className={`text-[10px] ml-auto ${subColor}`}>{trackSub}</span>
                </div>

                {/* カード本体 */}
                <div className={`px-[14px] py-3 ${bodyBg}`}>
                    <div className="text-[12px] text-[#4a9e6a] mb-[6px]">{nextLabel}</div>
                    <div className="flex items-center gap-[10px]">
                        <span className="text-[32px] font-light text-white leading-none">
                            {train !== null ? formatTime(train.hour, train.minute) : '終電済'}
                        </span>
                        {train !== null && <TypeBadge trainType={train.trainType} />}
                        {remainMin !== null && (
                            <div className="ml-auto flex items-baseline gap-[2px] whitespace-nowrap">
                                <span className="text-[11px] text-[#4a9e6a]">あと&thinsp;</span>
                                <span className="text-[22px] font-medium text-[#4a9e6a] leading-none">
                                    {formatRemain(remainMin)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

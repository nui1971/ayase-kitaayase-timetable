import { useMemo } from 'react'
import type { DayType, Train, Timetable } from '../data/timetable'

interface UseTrainsResult {
    nextP0: Train | null
    nextP34: Train | null
    upcomingList: Train[]
    isNextDay: boolean
    nextDayType: DayType
}

// サービス日の曜日を返す（0〜4時台は前日のサービス日として扱う）
export const getServiceDay = (now: Date): number => {
    const h = now.getHours()
    const day = now.getDay()
    return h < 5 ? (day + 6) % 7 : day
}

// 翌日のdayTypeを返す（曜日のみで判定）
export const getNextDayType = (serviceDay: number): DayType => {
    const nextDay = (serviceDay + 1) % 7
    return nextDay === 0 || nextDay === 6 ? 'holiday' : 'weekday'
}

export const filterTrains = (
    timetable: Timetable,
    dayType: DayType,
    now: Date
): UseTrainsResult => {
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const upcoming = timetable[dayType].filter(t => t.hour * 60 + t.minute > nowMin)

    if (upcoming.length > 0) {
        const nextP0 = upcoming.find(t => t.platform === 0) ?? null
        const nextP34 = upcoming.find(t => t.platform === 3 || t.platform === 4) ?? null
        return { nextP0, nextP34, upcomingList: upcoming.slice(0, 5), isNextDay: false, nextDayType: dayType }
    }

    // 終電後 → 翌日ダイヤに切替
    const nextDayType = getNextDayType(getServiceDay(now))
    const nextDayTrains = timetable[nextDayType]
    const nextP0 = nextDayTrains.find(t => t.platform === 0) ?? null
    const nextP34 = nextDayTrains.find(t => t.platform === 3 || t.platform === 4) ?? null

    return { nextP0, nextP34, upcomingList: nextDayTrains.slice(0, 5), isNextDay: true, nextDayType }
}

export const useTrains = (timetable: Timetable, dayType: DayType, now: Date): UseTrainsResult => {
    return useMemo(() => filterTrains(timetable, dayType, now), [timetable, dayType, now])
}

import { useMemo } from 'react'
import type { Train } from '../data/timetable'

interface UseTrainsResult {
    nextP0: Train | null
    nextP34: Train | null
    upcomingList: Train[]
}

export const useTrains = (trains: Train[], now: Date): UseTrainsResult => {
    return useMemo(() => {
        const nowMin = now.getHours() * 60 + now.getMinutes()

        const upcoming = trains.filter(t => t.hour * 60 + t.minute > nowMin)

        const nextP0 = upcoming.find(t => t.platform === 0) ?? null
        const nextP34 = upcoming.find(t => t.platform === 3 || t.platform === 4) ?? null
        const upcomingList = upcoming.slice(0, 5)

        return { nextP0, nextP34, upcomingList }
    }, [trains, now])
}

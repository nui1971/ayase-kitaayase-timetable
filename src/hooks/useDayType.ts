import { useState, useEffect } from 'react'
import type { DayType } from '../data/timetable'

const isHoliday = (date: Date, holidays: Set<string>): boolean => {
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')
    return holidays.has(`${yyyy}-${mm}-${dd}`)
}

const detectDayType = (date: Date, holidays: Set<string>): DayType => {
    const day = date.getDay()
    if (day === 0 || day === 6) return 'holiday'
    if (isHoliday(date, holidays)) return 'holiday'
    return 'weekday'
}

const fetchHolidays = async (year: number): Promise<Set<string>> => {
    const key = `holidays_${year}`
    const cached = sessionStorage.getItem(key)
    if (cached) return new Set(JSON.parse(cached) as string[])
    try {
        const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`)
        const data: Record<string, string> = await res.json()
        const dates = Object.keys(data)
        sessionStorage.setItem(key, JSON.stringify(dates))
        return new Set(dates)
    } catch {
        return new Set()
    }
}

interface UseDayTypeResult {
    dayType: DayType
    setDayType: (type: DayType) => void
    isManual: boolean
}

export const useDayType = (now: Date): UseDayTypeResult => {
    const [dayType, setDayTypeState] = useState<DayType>(() => {
        const day = now.getDay()
        return day === 0 || day === 6 ? 'holiday' : 'weekday'
    })
    const [isManual, setIsManual] = useState(false)

    useEffect(() => {
        if (isManual) return
        fetchHolidays(now.getFullYear()).then(holidays => {
            setDayTypeState(detectDayType(now, holidays))
        })
    }, [now, isManual])

    const setDayType = (type: DayType) => {
        setDayTypeState(type)
        setIsManual(true)
    }

    return { dayType, setDayType, isManual }
}

export const pad2 = (n: number): string => String(n).padStart(2, '0')

export const formatTime = (h: number, m: number): string => `${pad2(h)}:${pad2(m)}`

export const formatRemain = (diffMin: number): string => {
    if (diffMin < 60) return `${diffMin}分`
    const h = Math.floor(diffMin / 60)
    const m = diffMin % 60
    if (m === 0) return `${h}時間`
    return `${h}時間${m}分`
}

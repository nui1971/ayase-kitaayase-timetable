import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../components/Header'

describe('Header', () => {
    it('通常時: 日付のみ表示されること', () => {
        render(
            <Header
                time="10:30"
                date="2026/05/04 (月)"
                nextDate="05/05 (火)"
                isNextDay={false}
                hours={10}
            />
        )
        expect(screen.getByText('2026/05/04 (月)')).toBeInTheDocument()
        expect(screen.queryByText(/→ 翌/)).toBeNull()
    })

    it('終電後・hours>=5: 「→ 翌」が表示されること', () => {
        render(
            <Header
                time="23:50"
                date="2026/05/15 (金)"
                nextDate="05/16 (土)"
                isNextDay={true}
                hours={23}
            />
        )
        expect(screen.getByText(/→ 翌/)).toBeInTheDocument()
        expect(screen.getByText(/05\/16/)).toBeInTheDocument()
    })

    it('深夜・hours<5: 「→ 翌」が表示されないこと', () => {
        render(
            <Header
                time="00:30"
                date="2026/05/04 (月)"
                nextDate="05/05 (火)"
                isNextDay={true}
                hours={0}
            />
        )
        expect(screen.queryByText(/→ 翌/)).toBeNull()
        expect(screen.getByText('2026/05/04 (月)')).toBeInTheDocument()
    })
})

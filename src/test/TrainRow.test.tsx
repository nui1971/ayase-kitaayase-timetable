import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrainRow } from '../components/TrainRow'
import type { Train } from '../data/timetable'

describe('TrainRow - 番線バッジ', () => {
    it('platform 0: バッジに「0番線」が表示されること', () => {
        const train: Train = { hour: 10, minute: 0, platform: 0, trainType: '普通' }
        render(<TrainRow train={train} remainMin={5} />)
        expect(screen.getByText('0番線')).toBeInTheDocument()
    })

    it('platform 3: バッジに「3・4番線」が表示されること', () => {
        const train: Train = { hour: 10, minute: 15, platform: 3, trainType: '普通' }
        render(<TrainRow train={train} remainMin={20} />)
        expect(screen.getByText('3・4番線')).toBeInTheDocument()
    })

    it('platform 4: バッジに「3・4番線」が表示されること', () => {
        const train: Train = { hour: 10, minute: 30, platform: 4, trainType: '普通' }
        render(<TrainRow train={train} remainMin={35} />)
        expect(screen.getByText('3・4番線')).toBeInTheDocument()
    })
})

describe('TrainRow - 時刻・行き先表示', () => {
    it('時刻が正しくフォーマットされて表示されること', () => {
        const train: Train = { hour: 10, minute: 5, platform: 0, trainType: '普通' }
        render(<TrainRow train={train} remainMin={10} />)
        expect(screen.getByText('10:05')).toBeInTheDocument()
    })

    it('行き先「北綾瀬」が表示されること', () => {
        const train: Train = { hour: 10, minute: 0, platform: 0, trainType: '普通' }
        render(<TrainRow train={train} remainMin={5} />)
        expect(screen.getByText('北綾瀬')).toBeInTheDocument()
    })
})

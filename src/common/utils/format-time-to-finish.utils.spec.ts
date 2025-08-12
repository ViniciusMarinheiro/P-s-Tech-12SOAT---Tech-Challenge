import { formatTimeToFinish } from './format-time-to-finish'

describe('Format Time To Finish Utils', () => {
  describe('formatTimeToFinish', () => {
    describe('apenas minutos', () => {
      it('should format 1 minute correctly', () => {
        expect(formatTimeToFinish(1)).toBe('1 minuto')
      })

      it('should format 30 minutes correctly', () => {
        expect(formatTimeToFinish(30)).toBe('30 minutos')
      })

      it('should format 59 minutes correctly', () => {
        expect(formatTimeToFinish(59)).toBe('59 minutos')
      })
    })

    describe('horas e minutos', () => {
      it('should format 1 hour correctly', () => {
        expect(formatTimeToFinish(60)).toBe('1 hora e 0 minutos')
      })

      it('should format 1 hour and 30 minutes correctly', () => {
        expect(formatTimeToFinish(90)).toBe('1 hora e 30 minutos')
      })

      it('should format 2 hours correctly', () => {
        expect(formatTimeToFinish(120)).toBe('2 horas e 0 minutos')
      })

      it('should format 2 hours and 45 minutes correctly', () => {
        expect(formatTimeToFinish(165)).toBe('2 horas e 45 minutos')
      })

      it('should format 23 hours and 59 minutes correctly', () => {
        expect(formatTimeToFinish(1439)).toBe('23 horas e 59 minutos')
      })
    })

    describe('dias, horas e minutos', () => {
      it('should format 1 day correctly', () => {
        expect(formatTimeToFinish(1440)).toBe('1 dia, 0 horas e 0 minutos')
      })

      it('should format 1 day and 1 hour correctly', () => {
        expect(formatTimeToFinish(1500)).toBe('1 dia, 1 hora e 0 minutos')
      })

      it('should format 1 day, 1 hour and 30 minutes correctly', () => {
        expect(formatTimeToFinish(1530)).toBe('1 dia, 1 hora e 30 minutos')
      })

      it('should format 2 days correctly', () => {
        expect(formatTimeToFinish(2880)).toBe('2 dias, 0 horas e 0 minutos')
      })

      it('should format 2 days, 5 hours and 15 minutes correctly', () => {
        expect(formatTimeToFinish(3075)).toBe('2 dias, 3 horas e 15 minutos')
      })

      it('should format 1 day, 23 hours and 2 minutes correctly', () => {
        expect(formatTimeToFinish(2762)).toBe('1 dia, 22 horas e 2 minutos')
      })
    })

    describe('casos especiais', () => {
      it('should handle 0 minutes correctly', () => {
        expect(formatTimeToFinish(0)).toBe('0 minutos')
      })

      it('should handle decimal minutes by rounding', () => {
        expect(formatTimeToFinish(30.4)).toBe('30 minutos')
        expect(formatTimeToFinish(90.3)).toBe('1 hora e 30 minutos')
        expect(formatTimeToFinish(1440.4)).toBe('1 dia, 0 horas e 0 minutos')
      })

      it('should handle very large time periods', () => {
        expect(formatTimeToFinish(10080)).toBe('7 dias, 0 horas e 0 minutos')
        expect(formatTimeToFinish(10081)).toBe('7 dias, 0 horas e 1 minuto')
      })
    })

    describe('singular vs plural', () => {
      it('should use singular for 1 day', () => {
        expect(formatTimeToFinish(1440)).toBe('1 dia, 0 horas e 0 minutos')
      })

      it('should use plural for multiple days', () => {
        expect(formatTimeToFinish(2880)).toBe('2 dias, 0 horas e 0 minutos')
      })

      it('should use singular for 1 hour', () => {
        expect(formatTimeToFinish(60)).toBe('1 hora e 0 minutos')
      })

      it('should use plural for multiple hours', () => {
        expect(formatTimeToFinish(120)).toBe('2 horas e 0 minutos')
      })

      it('should use singular for 1 minute', () => {
        expect(formatTimeToFinish(1)).toBe('1 minuto')
      })

      it('should use plural for multiple minutes', () => {
        expect(formatTimeToFinish(2)).toBe('2 minutos')
      })
    })
  })
})

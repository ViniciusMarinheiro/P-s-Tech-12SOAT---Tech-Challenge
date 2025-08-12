export function formatTimeToFinish(minutes: number): string {
  const days = Math.floor(minutes / (24 * 60))
  const hours = Math.floor((minutes % (24 * 60)) / 60)
  const remainingMinutes = Math.round(minutes % 60)

  if (days === 0 && hours === 0) {
    const minutesText = remainingMinutes === 1 ? 'minuto' : 'minutos'
    return `${remainingMinutes} ${minutesText}`
  }

  if (days === 0) {
    const hoursText = hours === 1 ? 'hora' : 'horas'
    const minutesText = remainingMinutes === 1 ? 'minuto' : 'minutos'
    return `${hours} ${hoursText} e ${remainingMinutes} ${minutesText}`
  }

  const daysText = days === 1 ? 'dia' : 'dias'
  const hoursText = hours === 1 ? 'hora' : 'horas'
  const minutesText = remainingMinutes === 1 ? 'minuto' : 'minutos'

  return `${days} ${daysText}, ${hours} ${hoursText} e ${remainingMinutes} ${minutesText}`
}

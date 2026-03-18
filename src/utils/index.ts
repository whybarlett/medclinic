// formatPhone.ts
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const d = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits
  if (d.length === 10) {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`
  }
  return raw
}

export function maskPhone(value: string): string {
  // Оставляем только цифры, убираем ведущую 7 или 8 если есть
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) digits = '7' + digits.slice(1)
  if (!digits.startsWith('7')) digits = '7' + digits
  digits = digits.slice(0, 11) // максимум 11 цифр включая 7

  // d[0]=7, d[1-3]=код, d[4-6]=XXX, d[7-8]=XX, d[9-10]=XX
  const d = digits
  let result = '+7'
  if (d.length > 1) result += ` (${d.slice(1, 4)}`
  if (d.length > 4) result += `) ${d.slice(4, 7)}`
  else if (d.length > 1) result += ')'
  if (d.length > 7) result += `-${d.slice(7, 9)}`
  if (d.length > 9) result += `-${d.slice(9, 11)}`
  return result
}

// formatDate.ts
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', options ?? { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, { day: 'numeric', month: 'short' })
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getWeekDays(): { date: Date; label: string; dayName: string }[] {
  const days = []
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    days.push({
      date,
      label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      dayName: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : dayNames[date.getDay()],
    })
  }
  return days
}

// declension.ts
export function declension(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod100 >= 11 && mod100 <= 14) return forms[2]
  if (mod10 === 1) return forms[0]
  if (mod10 >= 2 && mod10 <= 4) return forms[1]
  return forms[2]
}

// врач/врача/врачей
export const doctorWord = (n: number) => `${n} ${declension(n, ['врач', 'врача', 'врачей'])}`
export const yearWord = (n: number) => `${n} ${declension(n, ['год', 'года', 'лет'])}`
export const reviewWord = (n: number) => `${n} ${declension(n, ['отзыв', 'отзыва', 'отзывов'])}`
export const clinicWord = (n: number) => `${n} ${declension(n, ['клиника', 'клиники', 'клиник'])}`

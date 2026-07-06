export function formatYear(year, locale) {
  if (year < 0) {
    const abs = Math.abs(year)
    if (locale === 'zh') return `公元前 ${abs} 年`
    if (locale === 'ja') return `紀元前 ${abs} 年`
    return `${abs} BCE`
  }
  if (locale === 'zh') return `公元 ${year} 年`
  if (locale === 'ja') return `紀元 ${year} 年`
  return `${year} CE`
}

export function formatYearShort(year, locale) {
  if (year < 0) {
    const abs = Math.abs(year)
    if (locale === 'zh') return `前${abs}`
    if (locale === 'ja') return `前${abs}`
    return `${abs} BCE`
  }
  if (locale === 'zh') return `${year}`
  if (locale === 'ja') return `${year}`
  return `${year} CE`
}

export function formatRange(start, end, locale) {
  return `${formatYearShort(start, locale)} — ${formatYearShort(end, locale)}`
}

export function localized(obj, locale) {
  return obj?.[locale] ?? obj?.en ?? ''
}

export function yearToPercent(year, rangeStart, rangeEnd) {
  return ((year - rangeStart) / (rangeEnd - rangeStart)) * 100
}

export function percentToYear(percent, rangeStart, rangeEnd) {
  return Math.round(rangeStart + (percent / 100) * (rangeEnd - rangeStart))
}

export function getActivePeriods(periods, year) {
  return periods.filter((p) => year >= p.start && year <= p.end)
}

export function getActiveRulers(periods, year) {
  const results = []
  for (const period of periods) {
    for (const ruler of period.rulers) {
      if (year >= ruler.start && year <= ruler.end) {
        results.push({ period, ruler })
      }
    }
  }
  return results
}

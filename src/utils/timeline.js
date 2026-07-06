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

export function localizedContemporary(contemporary, locale) {
  if (!contemporary) return null
  if (Array.isArray(contemporary)) {
    const sep = locale === 'zh' ? '、' : locale === 'ja' ? '・' : ', '
    return contemporary.map((item) => localized(item, locale)).join(sep)
  }
  return localized(contemporary, locale)
}

export function yearToPercent(year, rangeStart, rangeEnd) {
  return ((year - rangeStart) / (rangeEnd - rangeStart)) * 100
}

export function percentToYear(percent, rangeStart, rangeEnd) {
  return Math.round(rangeStart + (percent / 100) * (rangeEnd - rangeStart))
}

export function getActivePolities(polities, year) {
  return polities.filter((p) => year >= p.start && year <= p.end)
}

export function getActiveRulers(polities, year) {
  const results = []
  for (const polity of polities) {
    for (const ruler of polity.rulers ?? []) {
      if (year >= ruler.start && year <= ruler.end) {
        results.push({ polity, ruler })
      }
    }
  }
  return results
}

export function isPolityActive(polity, year) {
  return year >= polity.start && year <= polity.end
}

export function barStyle(polity, range) {
  const left = yearToPercent(polity.start, range.start, range.end)
  const right = yearToPercent(polity.end, range.start, range.end)
  return {
    left: `${left}%`,
    width: `${Math.max(right - left, 0.4)}%`,
    '--bar-color': polity.color,
  }
}

export function rulerSegmentStyle(ruler, range) {
  const left = yearToPercent(ruler.start, range.start, range.end)
  const right = yearToPercent(ruler.end, range.start, range.end)
  return {
    left: `${left}%`,
    width: `${Math.max(right - left, 0.3)}%`,
  }
}

export function axisTicks(range, step = 500) {
  const ticks = []
  const first = Math.ceil(range.start / step) * step
  for (let y = first; y <= range.end; y += step) {
    ticks.push(y)
  }
  return ticks
}

export function formatAxisYear(year) {
  return year < 0 ? Math.abs(year) : year
}

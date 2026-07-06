import { createI18n } from 'vue-i18n'
import { getCookie } from '../utils/cookie'
import en from './en.json'
import ja from './ja.json'
import zh from './zh.json'

export const locales = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const LOCALE_COOKIE = 'chronologia_locale'
const savedLocale = getCookie(LOCALE_COOKIE)
const validCodes = locales.map((l) => l.code)
const initialLocale = validCodes.includes(savedLocale) ? savedLocale : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, ja, zh },
})

export { LOCALE_COOKIE }

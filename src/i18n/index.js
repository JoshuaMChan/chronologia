import { createI18n } from 'vue-i18n'
import en from './en.json'
import ja from './ja.json'
import zh from './zh.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { en, ja, zh },
})

export const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
  { code: 'zh', label: '中文' },
]

import { createI18n } from 'vue-i18n'
import en from './en.json'
import ja from './ja.json'
import zh from './zh.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ja, zh },
})

export const locales = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

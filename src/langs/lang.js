import { createI18n } from 'vue-i18n'
import en from './en'
import pt from './pt'

const messages = {
  en,
  pt
};

export const i18n = createI18n({
  locale: 'en',
  messages,
});
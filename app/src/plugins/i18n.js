import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../store'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

let default_lang = process.env.VUE_APP_I18N_LOCALE;
if (store.getters.user.lang && store.getters.user.lang !== "") {
  default_lang = store.getters.user.lang;
}

export default new VueI18n({
  locale: default_lang,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'us',
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  messages: loadLocaleMessages()
}) 
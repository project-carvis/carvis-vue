import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

function env() {
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }

  if( process.env.VUE_APP_NETLIFY_PREVIEW === 'true') {
    return 'deploy-preview'
  }

  return 'production'
}

export default (vue) => {
  Sentry.init({
    vue,
    dsn: 'https://d6e0397557fd4cefb61c460d0b0e4797@o582664.ingest.sentry.io/5736641',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    release: process.env.npm_package_version,
    environment: env()
  })
}

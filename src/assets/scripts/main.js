'use strict'
/**
 * Application Bootstrap
 *
 * @package     NodeJS API Viewer
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/NodeAPIViewer
 */

// Load Libraries
import Vue from 'vue'

// Load App
import App from 'app'

/**
 * Prototype Extends
 */
String.prototype.repeat = (times) => {
    return (new Array(times + 1)).join(this)
}

if (process.env.NODE_ENV === 'production') {
  Sentry.configureScope(scope => {
    scope.setLevel('error')
  })
  Sentry.init({
    dsn: window._env.SENTRY_TRACKER_DSN,
    release: window._env.SENTRY_TRACKER_VERSION
  })
}

Vue.config.devtools = (process.env.NODE_ENV === 'development')
Vue.config.silent = (process.env.NODE_ENV === 'production')

new Vue({
    render: h => h(App)
}).$mount('#app')

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
import VueRouter from 'vue-router'

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

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    // {
    //   path: '/:locale?',
    //   name: 'homepage',
    //   component: homepage,
    //   meta: {
    //     noContainer: true,
    //     displayNewTheme: true,
    //     displayOldTheme: false
    //   }
    // },
    // {
    //   path: '/:locale?/404',
    //   name: 'notFound',
    //   component: notFound,
    //   noContainer: true
    // },
    // {
    //   path: '*',
    //   name: 'notFoundAll',
    //   component: notFound,
    //   meta: {
    //     noContainer: false
    //   }
    // }
  ]
})

Vue.use(VueRouter)
Vue.config.devtools = (process.env.NODE_ENV === 'development')
Vue.config.silent = (process.env.NODE_ENV === 'production')

new Vue({
    // store: store,
    router: router,
    render: h => h(App)
}).$mount('#app')

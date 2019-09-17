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

// Load Config
import Config from 'config'

// Load App
import App from 'app'

/**
 * Prototype Extends
 */
String.prototype.repeat = (times) => {
    return (new Array(times + 1)).join(this)
}

// Set Sentry Endpoint
if ('production' === Config.env) {
    Sentry.configureScope((scope) => {
        scope.setLevel('error');
    });
    Sentry.init({
        dsn: 'https://199daa6b3c33469584a989d5dd31455b@sentry.io/1728931',
        release: Config.buildTime
    });
}

Vue.config.devtools = (process.env.NODE_ENV === 'development')
Vue.config.silent = (process.env.NODE_ENV === 'production')

new Vue({
    render: h => h(App)
}).$mount('#app')

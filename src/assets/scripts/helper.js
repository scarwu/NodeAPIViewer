'use strict';
/**
 * Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import axios from 'axios'
import marked from 'marked'

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

function log(...params) {
    if ('production' !== Config.env) {
        console.log.apply(this, params);
    }
}

function isEmpty(variable) {
    return (undefined === variable || null === variable);
}

function isNotEmpty(variable) {
    return (undefined !== variable && null !== variable);
}

function scrollTo(element, to, duration) {
    let from = element.scrollTop
    let currentTime = 0
    let increment = 20

    let animateScroll = () => {
        currentTime += increment;

        element.scrollTop = easeInOutQuad(currentTime, from, to, duration)

        if (currentTime <= duration) {
            setTimeout(animateScroll, increment)
        } else {
            element.scrollTop = to
        }
    }

    animateScroll()
}

function easeInOutQuad(currentTime, from, to, duration) {
    currentTime /= duration / 2;

    if (currentTime < 1) {
        return (to - from) / 2 * currentTime * currentTime + from;
    }

    currentTime--;

    return -(to - from) / 2 * (currentTime * (currentTime - 2) - 1) + from;
}

function fetchData(target, callback) {
    if (target in window.localStorage) {
        callback && callback(window.localStorage[target])
    } else {
        axios.get(`${Constant.apiUrl}/${target}.md`).then((res) => {
            window.localStorage[target] = marked(res.data)

            callback && callback(window.localStorage[target])
        }).catch((err) => {
            callback && callback(null)
        })
    }
}

function clearStorage() {
    for (let key in window.localStorage) {
        window.localStorage.removeItem(key)
    }

    location.reload()
}

export default {
    log: log,
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty,
    scrollTo: scrollTo,
    fetchData: fetchData,
    clearStorage: clearStorage
};

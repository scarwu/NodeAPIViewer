<template lang="pug">
div#app
    header#header
        h1.title NodeJS API Viewer
        span.description
            | by <a href="https://scar.tw" target="_blank">ScarWu</a>,
            | API Data from <a href="http://nodejs.org/api/" target="_blank">Node.js Manual & Documentation</a>,
            | and Source code on the <a href="https://github.com/scarwu/NodeAPIViewer" target="_blank">GitHub</a>.
        span.clear(@click="clearStorage")
            | Clear Cache
    div#main
        div#menu
            span(
                v-for="(data, index) in menu.list",
                :key="data.value",
                :class="{ 'is-active': menu.id === data.value }",
                @click="getOptionListAndContent(data.value)"
            ) {{ data.text }}
        div#option
            span(
                v-for="(data, index) in option.list",
                :key="data.value",
                :class="{  'is-active': option.id === data.value, 'is-h1': data.isH1, 'is-h2': data.isH2, 'is-h3': data.isH3 }",
                @click="clickOption(data.value)"
            ) {{ data.text }}
        div#content
            div.article(v-html="content")
            div.buffer
    div#mask
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'

const apiUrl = 'https://raw.githubusercontent.com/nodejs/node/master/doc/api'
const contentType = {
    miscs: true,
    globals: true,
    methods: true,
    vars: true,
    modules: true,
    classes: true,
    events: true,
    properties: true,
    options: true
}

export default {
    data () {
        return {
            menu: { list: [], id: null },
            option: { list: [], id: null },
            content: null
        }
    },
    methods: {
        scrollTo (element, to, duration) {
            let from = element.scrollTop
            let currentTime = 0
            let increment = 20

            let animateScroll = () => {
                currentTime += increment;

                element.scrollTop = this.easeInOutQuad(currentTime, from, to, duration)

                if (currentTime <= duration) {
                    setTimeout(animateScroll, increment)
                } else {
                    element.scrollTop = to
                }
            }

            animateScroll()
        },
        easeInOutQuad (currentTime, from, to, duration) {
            currentTime /= duration / 2;

            if (currentTime < 1) {
                return (to - from) / 2 * currentTime * currentTime + from;
            }

            currentTime--;

            return -(to - from) / 2 * (currentTime * (currentTime - 2) - 1) + from;
        },
        fetchData (target, callback) {
            if (target in window.localStorage) {
                callback && callback(window.localStorage[target])
            } else {
                axios.get(`${apiUrl}/${target}.md`).then((res) => {
                    window.localStorage[target] = marked(res.data)

                    callback && callback(window.localStorage[target])
                }).catch((err) => {
                    callback && callback(null)
                })
            }
        },
        getMenuList () {
            this.menu = { list: [], id: null }
            this.option = { list: [], id: null }
            this.content = null

            this.fetchData('index', (html) => {
                if (null === html) {
                    return
                }

                let menu = { list: [], id: null }
                let element = document.createElement('div')
                let appendMenuItem = (node) => {
                    menu.list.push({
                        text: node.textContent,
                        value: node.getAttribute('href').match(/(.+)\.html/)[1]
                    })
                }

                element.innerHTML = html
                element.querySelectorAll('ul')[0].querySelectorAll('a').forEach(appendMenuItem)
                element.querySelectorAll('ul')[1].querySelectorAll('a').forEach(appendMenuItem)

                menu.id = menu.list[0].value

                this.menu = menu
            })
        },
        getOptionListAndContent (target) {
            let content = document.querySelector('#content')

            if (undefined !== content && null !== content) {
                this.scrollTo(content, 0, 750)
            }

            this.menu.id = target
            this.option = { list: [], id: null }
            this.content = null

            this.fetchData(target, (html) => {
                if (null === html) {
                    return
                }

                let option = { list: [], id: null }
                let elememt = document.createElement('div')

                elememt.innerHTML = html
                elememt.querySelectorAll('h1, h2, h3').forEach((node) => {
                    option.list.push({
                        text: node.textContent,
                        value: node.getAttribute('id'),
                        isH1: node.tagName.toLowerCase() === 'h1',
                        isH2: node.tagName.toLowerCase() === 'h2',
                        isH3: node.tagName.toLowerCase() === 'h3'
                    })
                })

                option.id = option.list[0].value

                this.option = option
                this.content = html
            })
        },
        clickOption (target) {
            let content = document.querySelector('#content')

            this.scrollTo(
                content,
                content.querySelector('#' + target).offsetTop,
                750
            )
        },
        refreshOptionSelected () {
            let content = document.querySelector('#content')
            let blocks = content.querySelectorAll('h1, h2, h3')
            let lastId = false

            for (let index = 0; index < blocks.length; index++) {
                if (content.scrollTop < blocks[index].offsetTop) {
                    continue
                }

                lastId = blocks[index].getAttribute('id')
            }

            this.option.id = lastId
        },
        resizeBuffer () {
            let content = document.querySelector('#content')
            let article = content.querySelector('.article')
            let blocks = article.querySelectorAll('h1, h2, h3')
            let lastBlock = blocks[blocks.length - 1]

            content.querySelector('.buffer').style.height = content.clientHeight - (article.scrollHeight - lastBlock.offsetTop) - 20 + 'px'
        },
        clearStorage () {
            for (let key in window.localStorage) {
                window.localStorage.removeItem(key)
            }

            location.reload()
        }
    },
    created () {
        this.getMenuList()
        this.getOptionListAndContent(this.menu.id)
    },
    mounted () {
        document.querySelector('#content').addEventListener('scroll', () => {
            this.refreshOptionSelected()
        })

        document.querySelector('#content').addEventListener('resize', () => {
            this.refreshOptionSelected()
            this.resizeBuffer()
        })
    },
    updated () {
        this.refreshOptionSelected()
        this.resizeBuffer()
    }
}
</script>

<style lang="sass" scoped>

</style>

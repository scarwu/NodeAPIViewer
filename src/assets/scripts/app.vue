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
    div#container
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
    div#mask(v-show="isLoading")
        //- i.fas.fa-circle-notch.fa-spin
</template>

<script>
// Load Helper
import Helper from 'core/helper'

export default {
    data () {
        return {
            isLoading: false,
            menu: { list: [], id: null },
            option: { list: [], id: null },
            content: null
        }
    },
    methods: {
        getMenuList (callback) {
            this.menu = { list: [], id: null }
            this.option = { list: [], id: null }
            this.content = null
            this.isLoading = true

            Helper.fetchData('index', (html) => {
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
                this.isLoading = false

                callback && callback()
            })
        },
        getOptionListAndContent (target) {
            let content = document.querySelector('#content')

            if (Helper.isNotEmpty(content)) {
                Helper.scrollTo(content, 0, 750)
            }

            this.menu.id = target
            this.option = { list: [], id: null }
            this.content = null
            this.isLoading = true

            Helper.fetchData(target, (html) => {
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
                this.isLoading = false

                this.$nextTick(() => {
                    this.refreshOptionSelected()
                    this.resizeBuffer()
                })
            })
        },
        clickOption (target) {
            let content = document.querySelector('#content')

            if (Helper.isEmpty(content)) {
                return
            }

            Helper.scrollTo(
                content,
                content.querySelector('#' + target).offsetTop,
                750
            )
        },
        refreshOptionSelected () {
            let content = document.querySelector('#content')

            if (Helper.isEmpty(content)) {
                return
            }

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

            if (Helper.isEmpty(content)) {
                return
            }

            content.querySelector('.buffer').style.height = '0px'

            let article = content.querySelector('.article')
            let blocks = article.querySelectorAll('h1, h2, h3')

            if (Helper.isEmpty(blocks)) {
                return
            }

            let lastBlock = blocks[blocks.length - 1]

            if (Helper.isEmpty(lastBlock)) {
                return
            }

            content.querySelector('.buffer').style.height = content.clientHeight - (article.scrollHeight - lastBlock.offsetTop) + 'px'
        },
        clearStorage () {
            Helper.clearStorage()
        }
    },
    created () {
        this.getMenuList(() => {
            this.getOptionListAndContent(this.menu.id)
        })
    },
    mounted () {
        window.addEventListener('resize', () => {
            this.refreshOptionSelected()
            this.resizeBuffer()
        })

        document.querySelector('#content').addEventListener('scroll', () => {
            this.refreshOptionSelected()
        })

        this.refreshOptionSelected()
        this.resizeBuffer()
    }
}
</script>

<style lang="sass" scoped>

</style>

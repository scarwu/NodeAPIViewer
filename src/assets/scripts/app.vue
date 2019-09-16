<template lang="pug">
div#app
    header#header
        h1 NodeJS API Viewer
        span by <a href="https://scar.tw" target="_blank">ScarWu</a>,
            | API Data from <a href="http://nodejs.org/api/" target="_blank">Node.js Manual & Documentation</a>,
            | and Source code on the <a href="https://github.com/scarwu/NodeAPIViewer" target="_blank">GitHub</a>.
        span#clear(@click="clearStorage")
            | Clear Cache

    div#main
        div#menu
            span(v-for="(data, index) in menuList", @click="getOptionListAndContent(data.value)")
                | {{ data.text }}
        div#option
            span(v-for="(data, index) in optionList", @click="selectOption(data.value)")
                | {{ data.text }}
        div#content(v-html="content")
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
    components: {

    },
    data () {
        return {
            menuList: [],
            optionList: [],
            content: null
        }
    },
    computed: {

    },
    methods: {
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
            this.menuList = []

            this.fetchData('index', (html) => {
                if (null === html) {
                    return
                }

                let menuList = []
                let elem = document.createElement('div')
                let appendMenu = (node) => {
                    let elem = document.createElement('span')

                    menuList.push({
                        text: node.innerHTML,
                        value: node.getAttribute('href').match(/(.+)\.html/)[1]
                    })
                }

                elem.innerHTML = html
                elem.querySelectorAll('ul')[0].querySelectorAll('a').forEach(appendMenu)
                elem.querySelectorAll('ul')[1].querySelectorAll('a').forEach(appendMenu)

                this.menuList = menuList

                // document.querySelectorAll('#menu span')[0].click()
            })
        },
        getOptionListAndContent (target) {
            this.optionList = []
            this.content = null
            // $('#content').stop().animate({
            //     scrollTop: 0
            // }, 750)

            this.fetchData(target, (html) => {
                if (null === html) {
                    return
                }

                let optionList = []
                let elem = document.createElement('div')

                elem.innerHTML = html
                elem.querySelectorAll('h2').forEach((node) => {
                    optionList.push({
                        text: node.innerHTML,
                        value: node.getAttribute('id')
                    })
                })

                this.optionList = optionList
                this.content = html

                // printContent(data, 1, () => {
                //     selectOption()
                //     contentResize()

                //     for (let index = 0 index < $('#option span').size() index++) {
                //         $('#option span').eq(index).attr('data-order', index)
                //     }
                // })
            })
        },
        printContent (data, level, callback) {
            // for (let key in data) {
            //     if (false === (key in contentType)) {
            //         continue
            //     }

            //     for (let order in data[key]) {
            //         let current = data[key][order]

            //         let div = $('<div>').attr('class', 'block')
            //         let header = $('<h' + level + '>')
            //             .html(current.textRaw.replace('\\', ''))
            //             .attr('id', null)
            //         div.append(header)

            //         let desc = $('<div>')

            //         if ('stability' in current) {
            //             let stability = $('<pre>').html('<code>Stability ' + current.stability +
            //                 ': ' + current.stabilityText + '</code>')
            //             desc.append(stability)
            //         }

            //         desc.append(current.desc)
            //         div.append(desc)

            //         $('#content').append(div)

            //         let item = $('<span>').html('&nbsp'.repeat((level - 1) * 8) + current.textRaw.replace('\\', ''))
            //         $('#option').append(item)

            //         printContent(current, level + 1)
            //     }
            // }

            // callback && callback()
        },
        selectOption (target) {
            // for (let index = $('#content .block').size()-1 index >= 0 index--) {
            //     if ($('#content .block').eq(index).position().top > 1) {
            //         continue
            //     }

            //     $('#option span').eq(index).addClass('active_b').siblings().removeClass('active_b')

            //     break
            // }
        },
        contentResize () {
            // if ($('#content .block').last().height() >= $('#content').height()) {
            //     return
            // }

            // $('#content .block').last().css({
            //     height: $('#content').height() - 30
            // })
        },
        clearStorage () {
            for (let key in window.localStorage) {
                window.localStorage.removeItem(key)
            }

            location.reload()
        }
    },
    watch: {

    },
    created () {

    },
    mounted () {
        document.querySelector('#content').addEventListener('scroll', () => {
            this.selectOption()
            this.contentResize()
        })

        // document.querySelector('#option').addEventListener('click', (e) => {
        //     if (e.target.tagName.toLowerCase() !== 'span') {
        //         return
        //     }

        //     let index = $(this).attr('data-order')
        //     let moveTo = $('#content .block').eq(index).position().top - $('#content .block').eq(0).position().top

        //     $('#content').stop().animate({
        //         scrollTop: moveTo
        //     }, 750)
        // })

        this.getMenuList()
    },
    updated () {

    },
    beforeDestroy () {

    }
}
</script>

<style lang="sass" scoped>

</style>

'use strict';
/**
 * Application Bootstrap
 *
 * @package     NodeJS API Viewer
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/NodeAPIViewer
 */

import axios from 'axios';
import marked from 'marked';
import $ from 'jquery';

let apiUrl = 'https://raw.githubusercontent.com/nodejs/node/master/doc/api';
let contentType = {
    miscs: true,
    globals: true,
    methods: true,
    vars: true,
    modules: true,
    classes: true,
    events: true,
    properties: true,
    options: true
};

/**
 * Prototype Extends
 */
String.prototype.repeat = (times) => {
    return (new Array(times + 1)).join(this);
};

/**
 * Default Functions
 */
let fetchData = (target, callback) => {
    if (target in window.localStorage) {
        callback && callback(window.localStorage[target]);
    } else {
        axios.get(`${apiUrl}/${target}.md`).then((res) => {
            window.localStorage[target] = res.data;

            callback && callback(res.data);
        }).catch((err) => {
            callback && callback(null);
        });
    }
}

// let printContent = (data, level, callback) => {
//     for (let key in data) {
//         if (false === (key in contentType)) {
//             continue;
//         }

//         for (let order in data[key]) {
//             let current = data[key][order];

//             let div = $('<div>').attr('class', 'block');
//             let header = $('<h' + level + '>')
//                 .html(current.textRaw.replace('\\', ''))
//                 .attr('id', null);
//             div.append(header);

//             let desc = $('<div>');

//             if ('stability' in current) {
//                 let stability = $('<pre>').html('<code>Stability ' + current.stability +
//                     ': ' + current.stabilityText + '</code>');
//                 desc.append(stability);
//             }

//             desc.append(current.desc);
//             div.append(desc);

//             $('#content').append(div);

//             let item = $('<span>').html('&nbsp;'.repeat((level - 1) * 8) + current.textRaw.replace('\\', ''));
//             $('#item').append(item);

//             printContent(current, level + 1);
//         }
//     }

//     callback && callback();
// }

let selectItem = () => {
    for (let index = $('#content .block').size()-1; index >= 0; index--) {
        if ($('#content .block').eq(index).position().top > 1) {
            continue;
        }

        $('#item span').eq(index).addClass('active_b').siblings().removeClass('active_b');

        break;
    }
}

let contentResize = () => {
    if ($('#content .block').last().height() >= $('#content').height()) {
        return;
    }

    $('#content .block').last().css({
        height: $('#content').height() - 30
    });
}

/**
 * Event Listeners
 */
document.querySelector('#clear').addEventListener('click', () => {
    for (let key in window.localStorage) {
        window.localStorage.removeItem(key);
    }

    location.reload();
});

document.querySelector('#content').addEventListener('scroll', () => {
    selectItem();
    contentResize();
});

// document.querySelector('#nav').addEventListener('click', () => {
//     if (e.target.tagName.toLowerCase() !== 'span') {
//         return;
//     }

//     $(this).addClass('active_a').siblings().removeClass('active_a');

//     $('#item').html('');
//     $('#content').html('');
//     $('#content').stop().animate({
//         scrollTop: 0
//     }, 750);

//     fetchData($(this).attr('class').split(' ')[0], function (data) {
//         printContent(data, 1, () => {
//             selectItem();
//             contentResize();

//             for (let index = 0; index < $('#item span').size(); index++) {
//                 $('#item span').eq(index).attr('data-order', index);
//             }
//         });
//     });
// });

// document.querySelector('#item').addEventListener('click', (e) => {
//     if (e.target.tagName.toLowerCase() !== 'span') {
//         return;
//     }

//     let index = $(this).attr('data-order');
//     let moveTo = $('#content .block').eq(index).position().top - $('#content .block').eq(0).position().top;

//     $('#content').stop().animate({
//         scrollTop: moveTo
//     }, 750);
// });

fetchData('index', (data) => {
    if (null === data) {
        return;
    }

    document.querySelector('#nav').innerHTML = marked(data);

    // data.desc.forEach((index) => {
    //     let item = data.desc[index];

    //     if ('text' !== item.type) {
    //         return;
    //     }

    //     let text = item.text.match(/\[(.+)\]\((.+)\.html\)/);

    //     $('#nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
    // });

    // $('#nav span').eq(0).click();
});

'use strict';
/**
 * Application Bootstrap
 *
 * @package     NodeJS API Viewer
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/NodeAPIViewer
 */

// Load Libraries
import $ from 'jquery';

String.prototype.repeat = (times) => {
    return (new Array(times + 1)).join(this);
};

let apiHost = 'https://nodejs.org/api/';
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

function fetchData (contentName, callback) {
    if (contentName in window.localStorage) {
        callback && callback(JSON.parse(window.localStorage[contentName]));
    } else {
        $.getJSON(apiHost + contentName + '.json', (data) => {
            window.localStorage[contentName] = JSON.stringify(data);

            callback && callback(data);
        });
    }
}

function printContent (data, level, callback) {
    for (var index in data) {
        if (index in contentType) {
            for (var order in data[index]) {
                var current = data[index][order];

                var div = $('<div>').attr('class', 'block');
                var header = $('<h' + level + '>')
                    .html(current.textRaw.replace('\\', ''))
                    .attr('id', null);
                div.append(header);

                var desc = $('<div>');

                if ('stability' in current) {
                    var stability = $('<pre>').html('<code>Stability ' + current.stability +
                        ': ' + current.stabilityText + '</code>');
                    desc.append(stability);
                }

                desc.append(current.desc);
                div.append(desc);

                $('#content').append(div);

                var item = $('<span>').html('&nbsp;'.repeat((level - 1) * 8) + current.textRaw.replace('\\', ''));
                $('#item').append(item);

                printContent(current, level + 1);
            }
        }
    }

    callback && callback();
}

function selectItem () {
    for (var index = $('#content .block').size()-1; index >= 0; index--) {
        if ($('#content .block').eq(index).position().top <= 1) {
            $('#item span').eq(index).addClass('active_b').siblings().removeClass('active_b');

            break;
        }
    }
}

function contentResize () {
    if ($('#content .block').last().height() < $('#content').height()) {
        $('#content .block').last().css({
            height: $('#content').height() - 30
        });
    }
}

$(document).ready(() => {
    fetchData('index', (data) => {
        $.each(data.desc, (index) => {
            var item = data.desc[index];

            if ('text' == item.type) {
                var text = item.text.match(/\[(.+)\]\((.+)\.html\)/);

                $('#nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
            }
        });

        $('#nav span').eq(0).click();
    });
});

$('body').delegate('#clear', 'click', () => {
    for (var index in window.localStorage) {
        window.localStorage.removeItem(index);
    }

    location.reload();
}).delegate('#nav span', 'click', () => {
    $(this).addClass('active_a').siblings().removeClass('active_a');

    $('#item').html('');
    $('#content').html('');
    $('#content').stop().animate({
        scrollTop: 0
    }, 750);

    fetchData($(this).attr('class').split(' ')[0], function (data) {
        printContent(data, 1, () => {
            selectItem();
            contentResize();

            for (var index = 0; index < $('#item span').size(); index++) {
                $('#item span').eq(index).attr('data-order', index);
            }
        });
    });
}).delegate('#item span', 'click', () => {
    var index = $(this).attr('data-order');
    var moveTo = $('#content .block').eq(index).position().top - $('#content .block').eq(0).position().top;

    $('#content').stop().animate({
        scrollTop: moveTo
    }, 750);
});

$('#content').on('scroll', () => {
    selectItem();
    contentResize();
});

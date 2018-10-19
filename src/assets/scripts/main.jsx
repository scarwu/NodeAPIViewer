'use strict';

var api_url = 'https://nodejs.org/api/';
var api_type = {
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

function getAPIData (target, cb) {
    if (target in window.localStorage) {
        var data = JSON.parse(window.localStorage[target]);
        cb && cb(data);
    }
    else {
        $.getJSON(api_url + target + '.json', function(data) {
            window.localStorage[target] = JSON.stringify(data);
            cb && cb(data);
        });
    }
}

function printContent (data, level, cb) {
    String.prototype.repeat = function(times) {
        return (new Array(times + 1)).join(this);
    };

    for (var index in data) {
        if (index in api_type) {
            for(var order in data[index]) {
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

    cb && cb();
}

function selectItem () {
    for (var index = $('#content .block').size()-1;index >= 0;index--) {
        var current = $('#content .block').eq(index);
        if(current.position().top <= 1) {
            $('#item span').eq(index).addClass('active_b').siblings().removeClass('active_b');
            return;
        }
    }
}

function contentResize () {
    if ($('#content .block').last().height() < $('#content').height()) {
        var content = $('#content .block').last().css({
            height: $('#content').height() - 30
        });
    }
}

$(document).ready(function () {
    getAPIData('index', function (data) {
        $.each(data.desc, function (index) {
            var item = data.desc[index];
            if ('text' == item.type) {
                var text = item.text.match(/\[(.+)\]\((.+)\.html\)/);
                $('#nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
            }
        });

        $('#nav span').eq(0).click();
    });
});

$('body').delegate('#clear', 'click', function () {
    for (var index in window.localStorage)
        window.localStorage.removeItem(index);
    
    location.reload();
}).delegate('#nav span', 'click', function () {
    $(this).addClass('active_a').siblings().removeClass('active_a');

    $('#item').html('');
    $('#content').html('');
    $('#content').stop().animate({
        scrollTop: 0
    }, 750);

    getAPIData($(this).attr('class').split(' ')[0], function (data) {
        printContent(data, 1, function () {
            selectItem();
            contentResize();

            for(var index = 0;index < $('#item span').size();index++) {
                $('#item span').eq(index).attr('data-order', index);
            }
        });
    });
}).delegate('#item span', 'click', function () {
    var index = $(this).attr('data-order');
    var moveTo = $('#content .block').eq(index).position().top - $('#content .block').eq(0).position().top;

    $('#content').stop().animate({
        scrollTop: moveTo
    }, 750);
});

$('#content').on('scroll', function () {
    selectItem();
    contentResize();
});

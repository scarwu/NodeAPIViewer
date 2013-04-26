'use strict';

var api_url = 'http://nodejs.org/api/';
var api_type = {
	miscs: true,
	globals: true,
	methods: true,
	vars: true,
	modules: true,
	classes: true,
	events: true,
	properties: true
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

				$('div.content').append(div);

				var item = $('<span>').html(current.textRaw.replace('\\', ''));
				$('div.item').append(item);

				printContent(current, level + 1);
			}
		}
	}

	cb && cb();
}

function selectItem () {
	for (var index = $('div.content .block').size()-1;index >= 0;index--) {
		var current = $('div.content .block').eq(index);
		if(current.position().top <= 1) {
			$('div.item span').eq(index).addClass('active_b').siblings().removeClass('active_b');
			return;
		}
	}
}

function contentResize () {
	if ($('div.content .block').last().height() < $('div.content').height()) {
		var content = $('div.content .block').last().css({
			height: $('div.content').height() - 30
		});
	}
}

$(document).ready(function () {
	getAPIData('index', function (data) {
		$.each(data.desc, function (index) {
			var item = data.desc[index];
			if ('text' == item.type) {
				var text = item.text.match(/\[(.+)\]\((.+)\.html\)/);
				$('div.nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
			}
		});

		$('div.nav span').eq(0).click();
	});
});

$('body').delegate('#clear', 'click', function () {
	for (var index in window.localStorage)
		window.localStorage.removeItem(index);
	
	location.reload();
}).delegate('div.nav span', 'click', function () {
	$(this).addClass('active_a').siblings().removeClass('active_a');

	$('div.item').html('');
	$('div.content').html('');
	$('div.content').stop().animate({
		scrollTop: 0
	}, 750);

	getAPIData($(this).attr('class').split(' ')[0], function (data) {
		printContent(data, 1, function () {
			selectItem();
			contentResize();

			for(var index = 0;index < $('div.item span').size();index++) {
				$('div.item span').eq(index).attr('data-order', index);
			}
		});
	});
}).delegate('div.item span', 'click', function () {
	var index = $(this).attr('data-order');
	var moveTo = $('div.content .block').eq(index).position().top - $('div.content .block').eq(0).position().top;

	$('div.content').stop().animate({
		scrollTop: moveTo
	}, 750);
});

$('div.content').on('scroll', function () {
	selectItem();
	contentResize();
});
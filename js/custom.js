'use strict';

var api_url = 'http://nodejs.org/api/';
var api_type = {
	miscs: true,
	globals: true,
	methods: true,
	vars: true,
	modules: true,
	classes: true
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

function printContent (data, level, count) {
	$.each(data, function (index) {
		if (index in api_type) {
			for(var order in data[index]) {
				var current = data[index][order];
				var header = $('<h' + level + '>')
					.html(current.textRaw.replace('\\', ''))
					.attr('id', null);
				
				$('div.content').append(header);

				var desc = $('<div>');
				
				if ('stability' in current) {
					var stability = $('<pre><code>').html('Stability ' + current.stability + ': ' + current.stabilityText);
					desc.append(stability);
				}

				desc.append(current.desc);
				$('div.content').append(desc);

				var item = $('<span>').html(current.textRaw.replace('\\', ''));
				$('div.item').append(item);

				printContent(current, level+1);
			}
		}
	});
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

$('body').delegate('div.nav span', 'click', function () {
	$(this).addClass('active_a').siblings().removeClass('active_a');

	$('div.item').html('');
	$('div.content').html('');

	getAPIData($(this).attr('class').split(' ')[0], function (data) {
		console.log(data);
		printContent (data, 1);
	});

}).delegate('div.item span', 'click', function () {
	console.log($(this).eq());

});
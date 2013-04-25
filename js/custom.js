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

function printContent (data) {
	$.each(data, function (index) {
		if (index in api_type) {
			for(var order in data[index]) {
				$('div.content').append('<h1>' + data[index][order].textRaw.replace('\\', '') + '</h1>');
				$('div.content').append('<p>' + data[index][order].desc + '</p>');

				$('div.item').append('<span>' + data[index][order].textRaw.replace('\\', '') + '</span>');

				printContent(data[index][order]);
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
		printContent (data);
	});

});
'use strict';

var api_url = 'http://nodejs.org/api/';
var api_type = {
	miscs: true,
	globles: true,
	methods: true,
	vars: true,
	modules: true,
};

$(document).ready(function () {
	console.log($('#api_data').text());

	$.getJSON(api_url + 'index.json', function(data) {
		$.each(data.desc, function (index) {
			var item = data.desc[index];
			if ('text' == item.type) {
				var text = item.text.match(/\[(.+)\]\((.+)\.html\)/);
				$('nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
			}
		});

		$('nav span').eq(0).click();
	});

});

$('body').delegate('nav span', 'click', function () {
	var target = $(this).attr('class');
	$('div.item').html('<h2>' + target + '</h2>');

	$.getJSON(api_url + target + '.json', function(data) {
		console.log(data);

		$.each(data.desc, function (index) {
			var item = data.desc[index];
			if ('text' == item.type) {
				var text = item.text.match(/\[(.+)\]\((.+)\.html\)/);
				$('nav').append('<span class="' + text[2] + '">' + text[1] + '</span>');
			}
		});
	});
}).delegate('div.item span', 'click', function() {
	
});
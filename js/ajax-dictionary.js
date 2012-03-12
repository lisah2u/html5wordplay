$(document).ready(function() {

	$('<div id="loading">Loading…</div>')
	.insertBefore('#dictionary')
	.ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
	});
	
	$('h3.term').live('click', function() {
		$(this).siblings('.definition').slideToggle();
	});

	$('#letter-a a').click(function() {
		$('#dictionary').hide().load('a.html', function() {
			$(this).fadeIn();		
		});
		return false;
	});
	$('#letter-b a').click(function() {
		$.getJSON('b.json',
			function(data) {
			var html = '';
			$.each(data, function(i, entry) {
				html += '<div class="entry">';
				html += '<h3 class="term">' + entry.term + '</h3>';
				html += '<div class="part">' + entry.part + '</div>';
				html += '<div class="definition">';
				html += entry.definition;
				if (entry.quote) {
					html += '<div class="quote">';
					$.each(entry.quote, function(lineIndex, line) {
						html += '<div class="quote-line">' + line + '</div>';
					});
					if (entry.author) {
						html += '<div class="quote-author">' + entry.author +
						'</div>';
					}
					html += '</div>';
					}
				html += '</div>';
				html += '</div>';
			});
			$('#dictionary').html(html);
		});
		return false;
	});
	$('#letter-c a').click(function() {
		$.getScript('c.js');
		return false;
	}); 
	$('#letter-d a').click(function() {
		$.get('d.xml', function(data) {
		
			$('#dictionary').empty();
			$(data).find('entry').each(function() {
				var $entry = $(this);
				var html = '<div class="entry">';
				html += '<h3 class="term">' + $entry.attr('term');
				html += '</h3>';
				html += '<div class="part">' + $entry.attr('part');
				html += '</div>';
				html += '<div class="definition">';
				html += $entry.find('definition').text();
				var $quote = $entry.find('quote');
				if ($quote.length) {
					html += '<div class="quote">';
					$quote.find('line').each(function() {
						html += '<div class="quote-line">';
						html += $(this).text() + '</div>';
					});
					if ($quote.attr('author')) {
						html += '<div class="quote-author">';
						html += $quote.attr('author') + '</div>';
					}
					html += '</div>';
				}
				html += '</div>';
				html += '</div>';
				$('#dictionary').append($(html));
			});
	});
	return false;
	});
	$('#letter-e a').click(function() {
		var requestData = {term: $(this).text()};
		$.get('e.php', requestData, function(data) {
		$('#dictionary').html(data);
		});
	return false;
	});
	$('#letter-f form').submit(function(event) {
		event.preventDefault();
		var formValues = $(this).serialize();
		$.get('f.php', formValues, function(data) {
			$('#dictionary').html(data);
		});
	});	
});
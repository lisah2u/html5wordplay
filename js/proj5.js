//JSONP works fine with get requests

	setInterval (function() {
	
    $.ajax({
//        url: 'http://localhost:3000/clock',
        url: 'http://growing-stream-5475.herokuapp.com/clock',
        dataType: "jsonp",
        jsonpCallback: "testcallback",
        cache: false,
        success: function(data) {
        	console.log("success");
        	data = parseTime(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
    return false;
	}
	, 5000 );


//JSONP does not work with POST requests using x-domain AJAX!
// for $.post - XMLHttpRequest cannot load http://localhost:3000/stem. Origin http://localhost is not allowed by Access-Control-Allow-Origin.

// Even for the GET below, my node.js server had to include:
//response.writeHead(200, {
//	'Content-Type': 'text/plain',
//	'Access-Control-Allow-Origin' : '*'
//});
// Useful tutorial here: http://net.tutsplus.com/tutorials/javascript-ajax/5-ways-to-make-ajax-calls-with-jquery/

$('#stemWords').on("click", function () {
	$('#results').text("");
	var data = JSON.stringify($("#textarea").val());
//	url = "http://localhost:3000/stem";
	url = 'http://growing-stream-5475.herokuapp.com/stem';
	callback = "porterStemmer";
	type = "json";
	console.log(data);
	
	results = $.get( url, data, callback, type );
	results.complete(function(){ show(results.responseText); });

	return false;  
});


function parseTime(json) {
	var obj = $.parseJSON(json);
	var time = obj.time;
	$('#time').html(time);
	console.log(time);	
}

function show(text) {	
	//need to do a JSON parse before iterating over values	
	text = JSON.parse( text );
	console.log(text);
	for (var i = 0; i < text.length; i++) {
	 	$('#results').append(text[i]);
	 	$('#results').append("\t");		
	 }
}

// $.fn.serializeObject = function() {
//     var o = {};
//     var a = this.serializeArray();
//     $.each(a, function() {
//         if (o[this.name] !== undefined) {
//             if (!o[this.name].push) {
//                 o[this.name] = [o[this.name]];
//             }
//             o[this.name].push(this.value || '');
//         } else {
//             o[this.name] = this.value || '';
//         }
//     });
//     return o;
// };

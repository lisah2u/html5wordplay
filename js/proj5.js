$('#getTime').on("click", function () {
	$('#time').text("");
    $.ajax({
        url: 'http://localhost:3000/clock',
        dataType: "jsonp",
        jsonpCallback: "testcallback",
        cache: false,
        success: function(data) {
        	data = parseTime(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
    return false;
});

$('#stemWords').on("click", function () {
	$('#results').text("");
	var data = JSON.stringify($("#textarea").val());
	//var data = JSON.stringify($("#form").serializeObject());
	url = "http://localhost:3000/stem";
	callback = "porterStemmer";
	console.log(data);

	$.ajax({
	  type: "POST",
	  url: "http://localhost:3000/stem",
	  data: "text="+$("#textarea").val(),
	  jsonpCallback: 'porterStemmer',
	  success: function(msg) {
	  	show(msg);
	  },
	  error: function(XMLHttpRequest, textStatus, errorThrown) {                                                                
		  	console.log('Ajax error was thrown.');
		  	console.log(XMLHttpRequest);
	  }                                       
	});	
	 return false;
});

function parseTime(json) {
	var obj = $.parseJSON(json);
	var time = obj.time;
	$('#time').append(time);
	console.log(time);	
}

function show(text) {
	$('#results').append(text);
	console.log(text);	
}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

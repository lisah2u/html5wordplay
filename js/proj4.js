$(document).ready(function () {

	$.ajaxSetup({ cache: false });

	$('#loading').ajaxStart(function() {
	    $(this).text("Loading...");
	    console.log('ajax start');
	});
	
	$('#loading').ajaxComplete(function() {
	    $(this).text("stop");
	    console.log('ajax complete');
	});

	data = new init();
	data.then(function (jSON) {					
		 //console.log(jSON);												
	});


});

  
function init() {											  
 	var deferred = $.Deferred(),
	jSON = [];
 
	$.when(
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			  {
			    tags: "dog",
			    tagmode: "any",
			    format: "json"
			  },
		  function(data) {
		    $.each(data.items, function(i,item){
		      $("<img/>").attr("src", item.media.m).appendTo("#images");
		      if ( i == 3 ) return false;
		    });
  		  }
  		))
		.then( 
			function (item) {
				$.each( item, function (index, value) {
					jSON.push(value);
				});
			deferred.resolve(jSON);
			}
		,
			function () {
				console.log("$.getJSON failed!");
			},
			function () {
				console.log("progress");
			}
			
		);

	return deferred;

}								               

function dump_props(obj, obj_name) {  
   var result = "";  
   for (var i in obj) {  
      result += obj_name + "." + i + " = " + obj[i] + "<br>";  
   }  
   result += "<hr>";  
   return result;  
}
/*
#iterate over map
var map = { 
  'item1': 'stuff', 
  'item2': 'more stuff' 
}; 
$.each(map, function(key, value) { 
  alert(key + ': ' + value); 
});
*/





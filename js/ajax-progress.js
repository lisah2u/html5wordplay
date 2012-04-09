//$(document).ready(function () {

	$('<div id="loading2">Loading…</div>')
	.insertBefore('#loading')
	.ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
	});	
	
/*
	$("#loading2").on("ajaxStart", function(){
	   $(this).show();
	}).on("ajaxStop", function(){
	   $(this).hide();
	});
*/
//	$("#loading").append('<p><img src="../images/ajax-loader.gif"></p>');

//Version2

/*
	  $.ajax({
	  url: "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	  dataType: 'JSONP',
	  data:  {
		    tags: "dog",
		    tagmode: "any",
		    format: "json"
		  },
	  cache: false,
	  success: function(data) {
			    $.each(data.items, function(i,item){
			      $("<img/>").attr("src", item.media.m).appendTo("#images");
			      if ( i == 3 ) return false;
			    });
			    
	  		  },
	  complete: function() { $('#loading').hide();	}	  
	  });
*/
	  //return false;

//});	

// Less complex that .ajax but with less fine-grained control
/*
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
	);
*/
	


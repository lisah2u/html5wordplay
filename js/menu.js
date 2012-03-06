/* menu items */

//$(document).ready(function () {
$(window).on("load",function () {
/* Load HTML fragment & CSS  */

	$("#selectors").on("click", function() {
		$("head").children(":last").detach();
		$("head").append("<link>");
			css = $("head").children(":last");
			css.attr({
					rel:	"stylesheet",
					type: "text/css",
					href: "css/proj1.css"
			});
		$("#dynamic").load('proj1/proj1-v1-fragment.html');  	
		//$.getScript("js/proj1.js");
		highlight = new Addhighlight();
	});	

	$("#poematic").on("click", function() {
		$("head").children(":last").detach();
		$("head").append("<link>");
			css = $("head").children(":last");
			css.attr({
					rel:	"stylesheet",
					type: "text/css",
					href: "css/proj2.css"
			});
		$("#dynamic").load('proj2/proj2-phrase-fragment.html');  	
		//$.getScript("js/proj2-phrase.js");
	});	

	/* Un-set and set active list items */	
	$("li").on("click", function() {
  		$("li").removeClass("active");
  		$(this).addClass("active");
	});

});


/* Menu. Testing */

/*
	$("#selectors").on("click", function() {
		$.when(
			$("head").append("<link>"),
			css = $("head").children(":last"),
			css.attr({
				rel:	"stylesheet",
				type: "text/css",
				href: style
			}),
			$.getScript(script),
			$("#dynamic").load(fragment),
			$.Deferred(
				function(deferred){
					$(deferred.resolve);
				})			
		).done()
	});	
*/	



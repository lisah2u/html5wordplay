/* Created this as an object for easy deletion 
this.nodeType == Node.TEXT_NODE does not work in IE... 

This code assumes that <p id=""> follows the following pattern where id =: 1a 1b 2a 2c 3a 3c, etc.
*/
highlight = new Addhighlight();

function Addhighlight () {
	console.log("highlight");
	var match;
	$('p[id]').contents().filter(function() {						   
		return this.nodeType === 3;;	
	})
	.wrap('<span />');
	
	$('p[id]').find('span').hover(function() {
		line = $(this).parent().prop('id');											   
		if (match = line.match(/(\d)+a/)) {								   
	 		$('p[id^='+match[1]+']').find('span').addClass("highlight")	   			  
	 	}	
		if (match = line.match(/(\d)+b/)) {
			$('p[id^='+match[1]+']').find('span').addClass("highlight") 
		}
	},
	function () {
	  	$('p[id]').find('span').removeClass("highlight") 
	});
}

/* Various Alternates */ 

/* Highlights a div with the class attribute poem 

function addHighlight1() {
	//console.log("highlight");
	$('.poem').contents();
	$('.poem').hover(function() {
		$(this).addClass("highlight");
		console.log("highlight hover");
		},
	function () {
	  	$(this).removeClass("highlight");
	});
}

*/

/* Highlights two divs that are children of the same row (e.g., col1 & col2) */
/*
function addHighlight2() {
  	$('.poem').on("hover",function(e) {
		$(this.childNodes).addClass("highlight");  
	},
	function () {
	  	$(this.childNodes).removeClass("highlight");
	});
}
*/

/* Highlights paragraphs that share the same number (e.g., 1a & 1b)

What if each column were in its own text box, or text in each column were of equal length? 

Turns out you can't use standard regular expressions inside of jQuery selectors or getElementbyId. You can
use a regex library with JQuery: James Pasolsey has written one here. http://fotis.posterous.com/regex-selector-for-jquery-james-padolsey

*/

/*
function addHighlight3() {
	var match;
	$('p[id]').contents().filter(function() {						  
		return this.nodeType === 3;					   
	})
	.wrap('<span />');
		
	$('p[id]').find('span').hover(function() {
		line = $(this).parent().prop('id');											   
		if (match = line.match(/(\d)+a/)) {								   
	 		$('p[id^='+match[1]+']').find('span').addClass("highlight")	   		  
	 	}	
		if (match = line.match(/(\d)+b/)) {
			$('p[id^='+match[1]+']').find('span').addClass("highlight") 
		}
	},
	function () {
	  	$('p[id]').find('span').removeClass("highlight") 
	});
}
*/

/* Cleaner version of highlight function above. Click function will enable scrolling highlight later */

/*
function addHighlight4() {
	var match;
	$('p[id]').contents().filter(function() {						   
		//console.log(Node.TEXT_NODE);
		//console.log(Node[3]);					  
		return this.nodeType == Node.TEXT_NODE;	
	})
	.wrap('<span />');
	
	$('p[id]').find('span').hover(function() {
		line = $(this).parent().prop('id');											   
		if (match = line.match(/(\d)+a/)) {								   
	 		$('p[id^='+match[1]+']').find('span').addClass("highlight")	   			  
	 	}	
		if (match = line.match(/(\d)+b/)) {
			$('p[id^='+match[1]+']').find('span').addClass("highlight") 
		}
	},
	function () {
	  	$('p[id]').find('span').removeClass("highlight") 
	});
}
*/


/* From Rouba.  */
/*
$.fn.highLight = function () {
	$('#right').delegate('div','click', function (e) {
		var className = $(this).attr('class');
		$('#right').find('div').removeClass('highlight');
		$(this).addClass('highlight');
		
		$('#left').contents().find('div').removeClass('highlight');
		var srcID = "." + className;
		$('left').contents().find(srcID).addClass('highlight');
	});
};
*/


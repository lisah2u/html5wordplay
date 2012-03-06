/*
This application flagrantly plagiarizes both Will Shakespeare and John Donne. It generates quatrains by randomly selecting from phrases from their various works. Phrases for each were pre-baked into json using open source texts and a bit of scripting. The json used here are only small snippets from much larger files sitting on the server. The longer files have some phrases both longer and shorter than 10 syllables. The function iambify below is intended to handle difficult phrases.
*/

poematic = new poem_init();
generateTitle();
poematic.then(function (donnePhrases, shakePhrases) {					
	var author = generateAuthor(donnePhrases,shakePhrases);
	makeQuatrain(author,donnePhrases,shakePhrases);														
});

             
function poem_init() {											  
	var deferred = $.Deferred()
	, donnePhrases = []
	, shakePhrases = [];
 
	$.when(
		$.getJSON('proj2/test-donne.json'),								  
		$.getJSON('proj2/test-shake.json'))								  
		.then( function (donne, shake) {
			$.each( donne[0], function (index, value) {
				donnePhrases.push(value);
			});

			$.each( shake[0], function (index, value) {
				shakePhrases.push(value);
			});

			deferred.resolve(donnePhrases, shakePhrases);
		});

	return deferred;
}

function makeQuatrain(author,donnePhrases,shakePhrases) {
	var lines = 4;
	$("div.line:has(p)").empty();
	
  	if (author === "Will Shakespeare") {
		thesePhrases = shakePhrases;	
  	}
  	else {	 thesePhrases = donnePhrases; 
  	}
  
  	for(index = 0; index < lines; index++) {						
		var rand = Math.floor(Math.random() * thesePhrases.length);
		myPhrase = iambify(index,thesePhrases[rand]);				    
		
		var p = document.createElement("p");		
		p.innerHTML = myPhrase;
		var div = document.getElementById('line' + (index+1));
		div.appendChild(p);
  }
}

function iambify(index,phrase) {
/* This is very kludgy. It's really just to selectively choose lines of not more than 10 syllables. There is a very nice pronunciation dictionary that would be useful for this (CMUdict). But it would require doing a lookup. Having a node.js service would be a good exercise for later.
*/

/* remove some sorts of end punctuation. Perhaps, keep question marks and commas. */
	if (index = 1 || 3) {								 
		str = phrase.replace(/[;:\.]$/g,"");
  	}
  	else { str = phrase.replace(/[;:,]$/g,"\."); }	   
  		str = phrase.replace(/[\",\]\[]$/g,"\.");			  
  	return(str);

/* Finish checking for syllable length. Will take 8-12. If too short, check to see if next item on the list can be added. If not, grab another random phrase. */

}

function generateTitle() {									
	var titles = [
		"Will or John, That is the Question",
	  	"16th Century Ramblings in the Dark",
	  	"Hey Nonny No (in a Drunken Stupor)",
	  	"Discarded Draft"
	 	];
	  
  	var rand = Math.floor(Math.random() * titles.length); 
  	var title = titles[rand];
 
  	$('#title > h1').contents().replaceWith(title);
}

function generateAuthor(donnePhrases,shakePhrases) {
  	var authors = ["Will Shakespeare","John Donne"];
  	var randAuthor = Math.floor(Math.random() * authors.length);
  	console.log(authors[randAuthor]);
  	
  	$('#author').popover({
  		title:"Guess!",
  		content:"Will Shakespeare or John Donne?",
  		animation: true,
  		placement: "left",
  		trigger:"hover"
  		}); 
  	//$('#author').popover.addClass("arrow");

	$('#guess').on("click", function () {
				$('#author').popover('disable'),
				$('#guess').replaceWith(authors[randAuthor]+'<br><a href="#" class="btn btn-primary" id="guess">Try Again!</a>')
			generateTitle(),
			author = authors[Math.floor(Math.random() * authors.length)],
			makeQuatrain(author,donnePhrases,shakePhrases)
		});


  	return authors[randAuthor];
}



/*
$(document).ready(function() {

	var def = init();
  	generateTitle();
  	var author = generateAuthor();

  	def.then(function (donnePhrases, shakePhrases) {				
   
//$.getJSON is asynchronous so we have to use deferred.then() to wait for the object to be resolved.
////makeQuatrain be in scope of this function since we need donnePhrases & shakePhrases
	
	makeQuatrain(author,donnePhrases,shakePhrases);														
  	});
});
*/
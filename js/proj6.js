//TODO Refactor for better event management. Asynch calls
//should be explicitely expressed using something like $.when $then

//TODO - Get rid of all global variables. Used these for
//ease of development and testing.

	var currentTrans = "";
	var currentTerm = "";
	var currentDict = [];
	var audios = [];  //all audio elements for a given search
	var dictList = []; // all dictionary data for a given search
	var popupList = [];
	var history = []; //minimal - does not yet include dictionary data
	var spinner;
	var spinTarget = $('#chinese');
	var target = document.getElementById('chinese');
	var canvas, context;	

$(function() {  


//Variable initialization
//incorporated spin.js library for spinner
	var spinOpts = {
	  lines: 13,
	  // The number of lines to draw
	  length: 8,
	  // The length of each line
	  width: 4,
	  // The line thickness
	  radius: 10,
	  // The radius of the inner circle
	  rotate: 0,
	  // The rotation offset
	  color: '#000',
	  // #rgb or #rrggbb
	  speed: 1,
	  // Rounds per second
	  trail: 60,
	  // Afterglow percentage
	  shadow: false,
	  // Whether to render a shadow
	  hwaccel: false,
	  // Whether to use hardware acceleration
	  className: 'spinner',
	  // The CSS class to assign to the spinner
	  zIndex: 2e9,
	  // The z-index (defaults to 2000000000)
	  top: 'auto',
	  // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};
	
	var popOpts = {
		animation: true,
		placement: 'top',
		trigger: 'hover',
		content: 'test',
		titile: 'title',
		delay: 0
	};
	
	$.ajaxSetup({ cache: false });
	$().popover(popOpts);	

	//TODO. Add lots more logging!
	var key = "91bcf466-b4ca-45b6-a0e7-aaf7aec1cfa5";
	var host = "http://logs.loggly.com";
	castor = new loggly({ url: host+'/inputs/'+key+'?rt=1', level: 'log'});
	castor.log("url="+window.location.href + " browser=" + castor.user_agent + " height=" + castor.browser_size.height);

//UI Events
	$('.entry').tooltip('show');
	chineseDiv = $('#chinese p');

	chineseDiv.delegate("span", "hover", function(e) {
	  		$(this).popover('show');
	  });
			
	chineseDiv.delegate("#audio", "click", function(e) {
		playAudio(currentTrans);
	});
	
	chineseDiv.delegate("span", "click", function(e) {
	   var id = $(this).text();
		var id = $.trim(id);
		spanClass = $('.' + id + '');
		charClass = $('.char');
		charClass.hide();  //toggle image & canvas
		$('span').removeClass('highlight');

 		if (e.target === this) {
			$(this).addClass('highlight');
			spanClass.show();  //toggle image & canvas
    		playAudio(id);
			//$(this).popover('show');
		}
	});
			

//This is where everything starts
	$('#translate').on("click", function (e) {
		//clear these lists for each translation
		//will set up a history list elsewhere
 			audios = [];
			dictList = [];
			$('#animChars').children().remove();
			$('#chars').children().remove();
			$('#flickr').children().remove();
			

			$('#chinese p').text("");
			$('#dict p').text("");

			e.preventDefault();  
			
			currentTerm = $("#userInput").val();
			currentTerm = validateText(currentTerm); 
			
			spinner = new Spinner(spinOpts).spin(target);

			var $defer = $.ajax({
					url: "http://growing-stream-5475.heroku.com/oauth",
					dataType: "jsonp",
					jsonpCallback: "getToken"
				});
			
			$defer.success(function(data, status, xhr) {
			 		appid = jQuery.parseJSON(data).token;
					ajaxTranslate(appid);
			});
		
			$defer.error(function(jqxhr, status, error) {
					alert("Oops. Problem with Microsoft Translator!");
			});				
	 });
});

// Just take the first word - no time to deal with phrases
	function validateText(text) {
		var text = text.split(" ",1);
		text = text[0];
		return text;
	}

//Ajax functions. Sites include Microsoft (getLanguage, translate, speak), Wordreference.com (dictionary
//look-up), flickr - and my own node.js server for oauth to Microsoft Azure and also a unicode to GB2312 hex value
//service required for chinese character image retrieval at http://lost-theory.org/
 
	function ajaxSpeak(jqxhr,text) {
		var p = {};
		p.text = text;
		p.language = 'zh-chs'; // more dialects zh-cht,zh-cn,zh-hk,zh-tw
		p.format = 'audio/wav';
		p.appId = "Bearer " + jqxhr;

		$.ajax({
			url: "http://api.microsofttranslator.com/V2/Ajax.svc/Speak",
			dataType: 'jsonp',
			data: p,
			jsonp: 'oncomplete',
			success: function(data) {
				ajaxSpeakCallback(data,text);
			},
			error: function(request, status, error) {
				console.log('speak error: status ' + status + ' desc ' + error);
			}
		});	
	}

	function getLanguages(jqxhr,text) {
		var p = {};
		p.appId = "Bearer " + jqxhr;

		$.ajax({
			url: "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForTranslate",
			dataType: 'jsonp',
			data: p,
			jsonp: 'oncomplete',
			success: function(data) {
			},
			error: function(request, status, error) {
				console.log('speak error: status ' + status + ' desc ' + error);
			}
		});	
	}
	
	function ajaxTranslate(jqxhr) {
		var p = {};
		p.to = "zh-CHS"; // Chinese Simplified (or Chinese Traditional zh-CHT)
		p.from = 'en';
		p.text = currentTerm;
		p.contentType = 'text/plain';
		p.appId = "Bearer " + jqxhr;
	
		$.ajax({
			url: "http://api.microsofttranslator.com/V2/Ajax.svc/Translate",
			dataType: 'jsonp',
			data: p,
			jsonp: 'oncomplete',
			//jsonpCallback: 'ajaxTranslateCallback',	
			success: function(data) {
				currentTrans = data;
				ajaxTranslateCallback(jqxhr);
				
				spinner.stop();
			},
			error: function(request, status, error) {
				console.log('translate error: status ' + status + ' desc ' + error);
			}
		});	
	}
	//http://api.wordreference.com/{API_key}/json/{dictionary}/{term}
	//http://api.wordreference.com/d404b/json/zhen/%E7%89%9B
	//http://api.wordreference.com/d404b/zhen/%E7%89%9B	
	function ajaxDict(text) {
		var text = encodeURIComponent(text);
		return $.ajax({
				url: "http://api.wordreference.com/d404b/json/zhen/" + text,
				dataType: "jsonp",
				crossDomain: true,
				cache: true,
				mimeType: 'application/json',
				success: function(data) {
					ajaxDictCallback(data);
				},
				error: function(request, status, error) {
					console.log('translate error: status ' + status + ' desc ' + error);
				}
			});
	}
	
	function ajaxPics(char) {
		//Would be great to get images from wikimeda commons:
		//http://commons.wikimedia.org/wiki/File:%E7%89%9B-bw.png (for example)
		//This URL references the character by utf-8
		//However, image URLs do not follow a replicable pattern. Argh.
		//var URL = "http://upload.wikimedia.org/wikipedia/commons/4/4e/%E6%96%87-order.gif";
		
		//Found another site at http://lost-theory.org/ocrat/chargif/anychar.html
		//To retrieve an html page you need UTF-16 hex (4 digit char) like this: num.toString(16);
		//http://lost-theory.org/ocrat/chargif/char/unicode.py?codepoint=4E00 (html page)
		
		//To retrieve embedded images you need to reference the code point in GB2312.
		//Thus, to get to images on the site you can use the following URLs:
		//http://lost-theory.org/ocrat/chargif/calig/d2bb.gif  caligraphy
		//http://lost-theory.org/ocrat/chargif/sod/d2bb.gif   animation
		//http://lost-theory.org/ocrat/chargif/bigchar/d2bb.gif  big

		//I tried the attached library (gb2312-utf8.js), but it does not return hex values:
		//var char = "文"; "文".charCodeAt(0) gives a decimal value 25991; 
		//If dec = 25991, utf16 = num.toString(16) = 6587
		//var gbGB2312UTF8.UTF8ToGB2312("\u6587");

		//In the end, I wrote a node.js server using help from two modules: iconv and buffertools.
		//iconv does the conversion, and buffertools let me convert the buffer to hex values

		return $.ajax({
			url: "http://growing-stream-5475.herokuapp.com/transcode",
			dataType: "text",
			data: char,
			cache: true,
			success:  function(data) {
				loadCharCanvas(data,char);
			}
		});
	}
	
	function ajaxFlickr(word) {
		return $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		  {
		    tags: currentTrans + "," + currentTerm,
		    tagmode: "any",
		    format: "json"
		  },
		    function(data) {
			loadFlickrCanvas(data,word);
		  }	
		);
	}	
	
//Ajax Callbacks
	function ajaxSpeakCallback(response,text) {
		addAudioNode(response,text);	
	}

	function ajaxTranslateCallback(jqxhr) {
		show(currentTrans);
		ajaxSpeak(jqxhr,currentTrans);
		ajaxDict(currentTrans);
		for (i=0;i<currentTrans.length;i++) {
			ajaxSpeak(jqxhr,currentTrans[i]);
		}
	}

	function ajaxDictCallback(json) {
		var term = { 
			"term": { 
				"english": currentTerm, 
				"MT": currentTrans 
				} 
			};
		appendJSON(json,term);
		//add to a dictionary list for this query
		dictList.push(json);

		if(json.Error) { return; }

		if(json.term0.Entries[0].OriginalTerm) {
			ChineseChar = json.term0.Entries[0].OriginalTerm.term;
		}	

		 if(json.term0.Entries[0].FirstTranslation) {
			EngTrans = json.term0.Entries[0].FirstTranslation.term;
			console.log(json);
			//show dict for total word only
			if( typeof $('#dict p span').val() === 'undefined' && json.Error !== "NoTranslation") {
				$('#dict p').append('<span class="entry">' + EngTrans + ' </span>');			 
			}
			else {
			//character translation goes in pop-over
				dataContent = {
				 	entry1Trans :  json.term0.Entries[0].FirstTranslation.term,
				 	entry1Trans :  json.term0.Entries[0].FirstTranslation.POS,
				 	entry1Trans :  json.term0.Entries[0].FirstTranslation.sense,
				 	entry2Trans :  json.term0.Entries[0].SecondTranslation.term,
				 	entry2Trans :  json.term0.Entries[0].SecondTranslation.POS,
				 	entry2Trans :  json.term0.Entries[0].SecondTranslation.sense,
				 	entry3Trans :  json.term0.Entries[0].ThirdTranslation.term || "",
				 	entry3Trans :  json.term0.Entries[0].ThirdTranslation.POS || "",
				 	entry3Trans :  json.term0.Entries[0].ThirdTranslation.sense || ""
					// side1Trans: json.term0.OtherSideEntries.FirstTranslation.term,
					// side1POS: json.term0.OtherSideEntries.FirstTranslation.POS,
					// side1Pinyin: json.term0.OtherSideEntries.FirstTranslation.Pinyin,
					// side1Sense: json.term0.OtherSideEntries.FirstTranslation.Pinyin,
					// side1Orig: json.term0.OtherSideEntries.FirstTranslation.term,
					// side1OrigPOS: json.term0.OtherSideEntries.FirstTranslation.POS,
					// side1OrigPinyin: json.term0.OtherSideEntries.FirstTranslation.Pinyin,
					// side1OrigSense: json.term0.OtherSideEntries.FirstTranslation.Pinyin,
				};
				popupList.push(dataContent);
			}
		}
	}

	//TODO - Browser compatibility check for audio. Sound check before ajaxSpeak call to get correct audio file type
	//WAV seems to work for all but IE.
	//DEBUG Looping not working in Chrome. Audio only plays once. Boo.
	function addAudioNode(audio,text) {
		var audioNode = document.createElement('audio');
		audioNode.setAttribute('src',audio);
		audioNode.setAttribute('id',text);
		audioNode.setAttribute('preload',"auto");
		//audioNode.loop = true;     //Causes FF to play over and over
		// if (typeof audioNode.loop == 'boolean') {
		// 	//audioNode.loop = true; //Causes FF to play over and over
		// }
		// else { 
		// 	audioNode.addEventListener('ended', function() {
		//     	this.currentTime = 0;
		//     	//this.play();
		// 	}, false);
		// }
		audios.push(audioNode);
	}

	function playAudio(id) {
	  id = $.trim(id);
	  //console.log("play audio " + id);
	  for (i=0;i<audios.length;i++) {
	    if (audios[i].getAttribute("id") === id) {      
	      audios[i].play();
	      break;
	    }
	  }
	}
	
	//Search dictionary for specific terms
	function dictChar(char) {
		
		len = dictList.length;
		for(var i=0; i<len; i+=1) {
			if(char === dictList[i].term0.Entries[0].OriginalTerm.term) {
				console.log(dictList[i]);
			}
		};
	}

	//After translate, most of the other services get called here
	function show(text) {
		ajaxDict(text);
		for (var i = 0; i < text.length; i++) {
			ajaxDict(text[i]);
			$('#chinese p').append('<span class="hover" id = "' + text[i] + '" class="popup-marker"> ' + text[i]) + '</span>';
			ajaxPics(text[i]);
			ajaxFlickr(text[i]);
		}
		$('#chinese p').append('<span id="audio" class="hover"><i class="icon-volume-up"></i></span>');		
		addToHistory();
		storeResults();
	}
	
	function appendJSON(obj1,obj2) {
		$.extend(obj1, obj2);
		return;
	}
	
	//Loads three images in a single canvas
	//TODO: re-factor since this is so repetitive
	function loadCharCanvas(hex,id){
		//console.log(hex);

		//http://lost-theory.org/ocrat/chargif/calig/d2bb.gif  caligraphy
		//http://lost-theory.org/ocrat/chargif/sod/d2bb.gif   animation
		//http://lost-theory.org/ocrat/chargif/bigchar/d2bb.gif  big
		canvas = document.createElement("canvas");
		canvas.setAttribute("width", "400");
		canvas.setAttribute("height", "400");
		canvas.setAttribute("class", "chars");
		canvas.setAttribute("name", id);
		
		dictChar(id);

		//dataContent = "data-content=" + 
		spanClass = '<span style= "display:none" class = "char ' + id + '"/>';
		$("#chars").append(canvas); 
		$('canvas.chars[name=' + id + ']').wrap(spanClass);

	    context = canvas.getContext('2d');  

		var data1 = "http://lost-theory.org/ocrat/chargif/calig/" + hex + ".gif";
		var data2 = "http://lost-theory.org/ocrat/chargif/sod/" + hex + ".gif";
		var data3 = "http://lost-theory.org/ocrat/chargif/bigchar/" + hex + ".gif";
		var img1 = new Image();
		var img2 = new Image();
		var img3 = new Image();
		img1.onload = function(){ 
	        context.drawImage(img1,0,100);
		};
		img2.onload = function(){  
//TODO: Browsers don't really support animated GIFs, but it may be possible to make this work.			
			//(function animate() {
				//var time = new Date().getTime() * 0.002;
		        //context.drawImage(img2,0,0);				
			//	requestAnimFrame(animate);
			//})();
		};
		//Work-around - image not in canvas
		$("#animChars").append('<img src=' + data2 + ' name = ' + id + ' class="anim" />');
		$('img.anim[name=' + id + ']').wrap(spanClass);
		img3.onload = function(){  
	        context.drawImage(img3,100,0);
		};
			
	    img1.src = data1;
	    img2.src = data2;
	    img3.src = data3;
	
	}

//TODO: Re-factor. Very repetitive. 	
	function loadFlickrCanvas(pics,id) {
		canvas = document.createElement("canvas");
		canvas.setAttribute("width", "400");
		canvas.setAttribute("height", "100");
		canvas.setAttribute("class", "flickr");
		canvas.setAttribute("name", id);
		spanClass = '<span style= "display:none" class = "char ' + id + '"/>';
		$("#flickr").append(canvas); 
		$('canvas.flickr[name=' + id + ']').wrap(spanClass);
		
	    context = canvas.getContext('2d');  
		
		var x = 0; y = 0;
		sources = {
			pic1: pics.items[0],
			pic2: pics.items[1],
			pic3: pics.items[2]
		};
		loadImages(sources, function(images) {
				context.drawImage(images.pic1,0,0,100,100);
				context.drawImage(images.pic2,100,0,100,100);
				context.drawImage(images.pic3,200,0,100,100);
			});
	    };
	
	function loadImages(sources,callback) {
		var images = {};
		var loadedImages = 0;
		var totalImages = 3;
		for (var src in sources) {
			images[src] = new Image();
			images[src].onload = function() {
				if(++loadedImages >= totalImages) {
				callback(images);
				}
			};
			images[src].src = sources[src].media.m;
		};
	}
	
	
	//Function below have more to do with state management and storage.
	//Checks to see if state is stored locally and restores. Use of HTML5 local storage seems inappropriate here.
	//Audio data cannot be stored due to both limitations of local storage and also the time-limited
	//Azure token embedded in audio elements.
	//You really need something like webSQL or an actual DB for all of the media files
	//So this should be regarded as simple experimentation done at the last minute.
	function resumeState() {
	
	
	}
	//takes the most recent term and loads into main view
	function loadCurrentTerm() {
	
	}
	
	//TODO - add localstorage and history using some other approach
	function storeResults() {
		if (Modernizr.localstorage) {
			// window.localStorage is available!
			//This is a very minimal demonstration
			localStorage.setItem("history", history);
		} 
				
	}
	
	function addToHistory() {
	//TODO: Counter so that when history grows to a certain
	//size, it's organized differently
		history.push({currentTerm:currentTrans});
		$('.history').prepend('<tr><td><p class="entry term">' + currentTerm + '</p></td><td><p  class="entry definition">' + currentTrans + '</p></td></tr>');	
	}

	//Animation of animated gifs does not work in canvas. But a few seem to find workarounds such as this.
	//Unfortunately, this is not working yet.
	//http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	//webkitRequestAnimationFrame(arguments.callee, canvas);
	// compatibility layer with setTimeout fallback
	window.requestAnimFrame = (function(time){
	    return (
				  window.requestAnimationFrame       || 
	              window.webkitRequestAnimationFrame || 
	              window.mozRequestAnimationFrame    || 
	              window.oRequestAnimationFrame      || 
	              window.msRequestAnimationFrame     || 
	              function( callback ){
	                window.setTimeout(callback, 1000 / 60);
				}
	    );
	})();
// TODO: timer to avoid getting a new access token for every request - should be
// able to request only once every 10 mins

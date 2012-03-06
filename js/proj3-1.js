$(document).ready(function () {

charlist = 6;   //Number of chars in dropdown
boxes = 4;      //Length of phrase or word
rows = 8;       //Number of game tries
pegs = 1;    //Current number of game rows 

        dict = dictionary_init();
        syllables = syllables_init();
        audioDict_init(dict);
        term = selectRandomTerm(dict);
        chars = select_chars(dict,term);
        setPopUp(charlist,chars);
        showGame(term);
        showHint(term);


// user wants to re-start game after winning
$('#clear').on("click",function() {
  $('li').removeClass('selected');
  pegs = 1;
  //delete all rows of pegs except one
  console.log("clear");
});

// user wants to re-start game after losing
$('#restart').on("click",function() {
  console.log("clear");
  $('li').removeClass('selected');
  pegs = 1;
  //delete all rows of pegs except one
});

// user hits submit button on less than four alert
$('#resubmit').on("click",function() {
  console.log("resubmit");
  $('li').removeClass('selected');
  addSquares();
});

// user hits main submit
      $('#go').on("click",function() {
  console.log("go");
  if($('.selected').length < 4) {
    $('#lessThanFour').modal({
        keyboard: true,
        show: true
    });  
    score = [[],];
  }
  else { 
    score = getScore(term);
  }
  returnScore(score);
  winLose(score);
});

//Clickable audio
$('.audio').on("click", function() {
    id = $('.audio').attr("id");
    play_audio(id);  
    });

 
//Custom control for drop-down pop-up
$('li[id^="s"]').on("click", function() {
  $(this).siblings().removeClass("selected");

  $(this).addClass("selected");
  id = $(this).prop("id");
  char =  $(this).text();
  audioID = lookupAudioID(char);
  play_audio(audioID);
  
  //console.log(id);
  num = $(this).prop("id").match(/s(\d)l\d/);
  //console.log(num);
  $('span[id^="s'+num[1]+'"]').removeClass("red-square");
  //console.log(char);
  var h2 = $('span[id^="s'+num[1]+'"]').parent();
  h2.replaceWith('<h2>'+char+'</h2>'); 
});  

//TODO - tooltips
$('.red-circle').on("hover", function() {
    
});

$('.blue-circle').on("hover", function() {
    //<a href="#" rel="tooltip" data-original-title="blue circle - right character in the wrong place"></a>      
});

});  //.ready
  
//Set initial game chars
function setPopUp(charlist,chars) {
  //console.log("set popup");
    var j = 0;
	for (k=1;k<=boxes;k++) {
		for (var i in chars) {
	      	var j = j+1;
	      	id = "s" + k + "l" + j;
	     	//console.log(chars[i] + id);
	     	$('li[id='+id+']').contents().replaceWith('<a href="#">'+chars[i]+'</a>');
	  	}	
	j = 0;    	
	}
  }


function addSquares() {
  $('span[id^="s"]').addClass("red-square");
  //$('span[id^="s"]').contents().replaceWith('<h2></h2>');  //<h2><span class="red-square" id="s2"></span></h2>
  var h2 = $('span[id^="s"]').parent();
  h2.replaceWith('<h2>'+char+'</h2>'); 
}

// searches for an element in an array by its key. Would be good
// to re-factor other array searches below...
function getScore (term) {
  console.log("get score "+term);

  var lookup = {};
  var found = [];  
  var exact = [];
  correct = term["chinese"];
  guess =  $('.selected').text(); 
  //correct = "蝦仁炒飯";       
  //guess = "鴨仁蝦飯";            

  for (var j in correct) {
      lookup[correct[j]] = correct[j];
      console.log(lookup[correct[j]]);
  }
   
  for (var i in guess) {
    console.log("i= " + guess[i] + "guess[i]=" + correct[i])
    if (guess[i] === correct[i]) {
      exact.push(i);
    }
      if (typeof lookup[guess[i]] != 'undefined') {
           found.push(guess[i]); 
      } 
  }
  partial = found.length - exact.length;
  return [exact,partial];
}

function winLose () {

//#id = clear or restart needs to re-set the game
  //var pegs = 1;
  //score = [[1,2,3,4],2];

  console.log("winlose "+score);
  if (score[0].length === 4) {
    console.log("win!");
    $('#win').show();
    
  }
  if (pegs > 7) { 
    console.log("lose!");
    $('#lose').show();
   }
   else {
     returnScore();
     addNewRow(boxes,charlist,chars);
   }
}

function returnScore (score) {
  console.log("return score " + score);

  circle = 1;
  
  if (typeof score != 'undefined') {  
    if (typeof score[[0]] != 'undefined') {
      for (i in score[[0]]) {
        $("#circle"+circle).removeClass("white-circle").addClass("red-circle"); 
        circle = circle+1;
      }
    }
    if (score[1] != 0) {
      for (i=1;i<score.length;i++) {
        $("#circle"+circle).removeClass("white-circle").addClass("blue-circle");
        circle = circle+1;      
      }
    }
  } 
}    

function addNewRow (boxes,charlist,chars) {
  console.log("addNewRow");
//make a copy of pegs-current

    pegs=pegs+1;
    clone = $('#pegs-current').clone();
    clone.find('*').each(function(index) {
    this.removeAttribute("id");
  });
  clone.find('.btn').detach();
  $(".span6:first").prepend(clone);
  clone.removeAttr("id");
  clone.find('.dropdown').detach();

//Select new chars 
  chars = select_chars(dict,term);  
  
//Re-set pegs-current (circles, dropdown, red squares)
  for (i=1;i<5;i++) {
    $("#circle"+i).removeClass("blue-circle");
    $("#circle"+i).removeClass("red-circle");
    $("#circle"+i).addClass("white-circle");
    $('#pegs-current').find("h2").replaceWith('<span class="red-square" id="s'+i+'">');
  }
    for (i=0;i<charlist;i++) {
	    $('li[id^="s"]').contents().replaceWith('<a href="#">'+char+'</a>');    
    }

}    


function showGame (term) {
  contents = 'What is the Chinese word for <strong>' + term["english"] + '</strong>?';
  $('div#game > p').append(contents);
}

function showHint (term) {
  id = term["sound"].match(/^sound\/(\w+).wav$/);
  contents = '<a href="#" class="audio" id='+id[1]+'><strong>' + term["pinyin"] + '</strong>?</a>';
  $('div#hint > p').append(contents);
}

function selectRandomTerm (dictionary) {
  var rand = Math.floor(Math.random() * dictionary.length);
  return dictionary[rand];
}

// For demo purposes. Should be a server-side look-up.
// Also -- would need both .wav and .mp3 to cover different browsers. .wav does not play in IE,
// but .mp3 does not play in Firefox.
function dictionary_init() {
  var dictionary = [
    {  chinese: "麻婆豆腐",
      pinyin: "má pó dòufu",
      english: "spicy tofu",
      sound: "sound/spicytofu.wav"
    },  
    {  chinese: "北平烤鴨",
      pinyin: "běi píng kǎoyā",
      english: "peking duck",
      sound: "sound/pekingduck.wav"
    },  
    {  chinese: "蝦仁炒飯",
      pinyin: "xiā rén chǎo fàn",
      english: "fried rice with shrimp",
      sound: "sound/friedriceshrimp.wav"
    }
  ];
  return dictionary;
}  
//This is also kludgy.
function syllables_init() {
  var syllables = [
    {  chinese: "麻",
      sound: ["sound/MA2M.WAV", "sound/MA2W.WAV"]
    },  
    {  chinese: "婆",
      sound: ["sound/PO2M.WAV", "sound/PO2W.WAV"]
    },  
    {  chinese: "豆", 
      sound: ["sound/DOU4M.WAV", "sound/DOU4W.WAV"]
    },
    {  chinese: "腐", 
      sound: ["sound/fu5.wav", "sound/fu5.wav"]
    },  
    {  chinese: "北",
      sound: ["sound/BEI3M.WAV", "sound/BEI3W.WAV"]
    },  
    {  chinese: "平",
      sound: ["sound/PING2M.WAV", "sound/PING2W.WAV"]
    },  
    {  chinese: "烤", 
      sound: ["sound/KAO3M.WAV", "sound/KAO3W.WAV"]
    },
    {  chinese: "鴨",
      sound: ["sound/YA1M.WAV", "sound/YA1W.WAV"]
    },  
    {  chinese: "蝦", 
      sound: ["sound/XIA1M.WAV", "sound/XIA1W.WAV"]
    },  
    {  chinese: "仁", 
      sound: ["sound/REN2M.WAV", "sound/REN2W.WAV"]
    },  
    {  chinese: "炒", 
      sound: ["sound/CHAO3M.WAV", "sound/CHAO3W.WAV"]
    },
    {  chinese: "飯",
      sound: ["sound/FAN4M.WAV", "sound/FAN4W.WAV"]
    }
  ];  
  return syllables;
}

//tokenizes dictionary terms, adds to a char list, selects both term and random chars
//also sends selected chars to addAudoNode
//TODO - refactor for performance
function select_chars(dictionary,term) {
  charlist = [];
  bagochars = [];
  chars = term["chinese"];
  for(i=0;i<chars.length;i++) {
    charlist.push(chars[i]);
  }
  for(i=0;i< dictionary.length;i++) {
    chars = dictionary[i]["chinese"];  
    for(j=0;j<chars.length;j++) {
      char = chars[j];
      bagochars.push(char);
      syllIndex = findIndexByKeyValue(syllables,"chinese",char);
      console.log(syllables[syllIndex].sound);
      addAudioNode(syllables[syllIndex].sound);  //passes a list
    }
  }
  // hard-coded to be six chars. Needs re-factoring.
  rand1 = Math.floor(Math.random() * bagochars.length);
  rand2 = Math.floor(Math.random() * bagochars.length);
  charlist.push(bagochars[rand1]); charlist.push(bagochars[rand2]);
  charlist.sort();  //not exactly random -- and we could easily add more chars to make the game more difficult
  return charlist;
}

//Look-up key in an array of objects
 //TODO - refactor for performance
function findIndexByKeyValue(obj, key, value) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            return i;
        }
    }
    return null;
}
//TODO - refactor for performance
function lookupAudioID (char) {
  //console.log("lookup char "+char);
    for (var i = 0; i < syllables.length; i++) {
      //console.log(syllables[i]["chinese"]);
        if (syllables[i]["chinese"] === char) {
          id = syllables[i]["sound"][0].match(/^sound\/(\w+).wav$/i);
            return id[1];
        }
    }
    return null;
}

function audioDict_init(dictionary) {
  audios = [];
  for (i= 0; i < dictionary.length; i++) {
    addAudioNode(dictionary[i]);
  }
  
}
// would be easy to randomize between male and female speakers
function addAudioNode(dictItem) {
//  console.log(dictItem);
  audio = document.createElement('audio');
  if (typeof dictItem.sound === "undefined") {
    audio.setAttribute('src',dictItem[0]);
    //console.log(dictItem[0]);   
    file = dictItem[0];
  }
  else { 
    audio.setAttribute('src',dictItem.sound);   
    //console.log(dictItem.sound);   
    file = dictItem.sound;     
  }
  id = file.match(/^sound\/(.+)\.(mp3|WAV)$/i);
  //console.log(id);
  audio.setAttribute('id',id[1]);
  audio.setAttribute('preload',"auto");
  audio.load();
  audios.push(audio);
}

function play_audio(id) {
  //console.log("play audio "+id);
  for (i=0;i<audios.length;i++) {
    //console.log(audios[i].attributes[1]);
    if (audios[i].getAttribute("id") === id) {
      
      audios[i].play();
      break;
    }
  }
}



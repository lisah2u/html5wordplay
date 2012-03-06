$(document).ready(function () {

charlist = 6;   //Number of chars in dropdown
boxes = 4;      //Length of phrase or word
rows = 8;       //Number of game tries
pegs = 1;    //Current number of game rows 

        dict = dictInit();
        syllables = syllInit();
        audioDictInit(dict);
        setGame();

// user wants to re-start game after winning or losing
$('#clear,#restart').on("click",function() {
  setGame();
});

// user hits submit button on less than four alert
$('#resubmit').on("click",function() {
  setRow();
});

// user hits main submit
      $('#go').on("click",function() {
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
    pegs = winLose(score);
});

$('#cancel').on("click", function() {
     $('.span6:first').find('.row-fluid:first').not('#pegs-current').detach();
});

//Clickable audio
$('.audio').on("click", function() {
    var id = $('.audio').attr("id");
    playAudio(id);  
});

//Custom control for drop-down pop-up
$('li[id^="s"]').on("click",function() {
  $(this).siblings().removeClass("selected");
  $(this).addClass("selected");
  var id = $(this).prop("id");
  var char =  $(this).text();
  audioID = lookupAudioID(char);
  playAudio(audioID);
  
  var num = $(this).prop("id").match(/s(\d)l\d/);
  $('span[id^="s'+num[1]+'"]').removeClass("red-square");
  var h2 = $('span[id^="s'+num[1]+'"]');
  h2.replaceWith('<h2>'+char+'</h2>');  

	$('li[id^="s"]').parent().one("click",function() {
	    $(this).css({display: "none"});
	});  

});  

//TODO - tooltips
$('.red-circle,.blue-circle').on("hover", function() {
    
});


});  //.ready
////////////////////////////////////////////////////////////////////////////////  
function setGame () {
    clearGameHint();
    term = selectRandomTerm();
    chars = selectChars(term);
    setPopUp(chars);
    showGame(term);
    showHint(term);
    removeRows();
    setRow();
}

//Set initial game chars
function setPopUp(chars) {
    var j = 0;
  for (k=1;k<=boxes;k++) {
    for (var i in chars) {
          var j = j+1;
          id = "s" + k + "l" + j;
         $('li[id='+id+']').contents().replaceWith('<a href="#">'+chars[i]+'</a>');
      }  
  j = 0;      
  }
}

//Set pegs-current (circles & red squares & turn back on vis of dropbox)
//This messiness really indicates that this code might be better organized
//in a more object-oriented fashion.

function setRow () {
  $('li[id^="s"]').removeClass("selected");
  $('li[id^="s"]').parent().removeAttr('style');
   
  for (i=1;i<5;i++) {
    $("#circle"+i).removeClass("blue-circle");
    $("#circle"+i).removeClass("red-circle");
    $("#circle"+i).addClass("white-circle");
    $('#pegs-current').find("h2:first").replaceWith('<span class="red-square" id="s'+i+'">');
  }
}
//make a copy of pegs-current and move up

function saveRow () {
    pegs=pegs+1;
    clone = $('#pegs-current').clone();
    clone.find('*').each(function(index) {
    this.removeAttribute("id");
  });
  clone.find('.btn').detach();
  $(".span6:first").prepend(clone);
  clone.removeAttr("id");
  clone.find('.dropdown').detach();
  return pegs;
}

function removeRows () {
	$('.span6:first').find('.row-fluid').not('#pegs-current').detach();
}

function winLose () {
  //score = [[1,2,3,4],2];

  if (score[0].length === 4) {
    $('#win').show();
    
  }
  if (pegs > 7) { 
    $('#lose').show();
   }
   else {
     returnScore();
     pegs = saveRow();
     setRow();
   }
  return pegs;
}

// searches for an element in an array by its key. Would be good
// to re-factor other array searches below...
function getScore (term) {
  var lookup = {};
  var found = [];  
  var exact = [];
  correct = term["chinese"];
  guess =  $('.selected').text(); 
  //correct = "蝦仁炒飯";       
  //guess = "鴨仁蝦飯";            

  for (var j in correct) {
      lookup[correct[j]] = correct[j];
  }
   
  for (var i in guess) {
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

function returnScore (score) {
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


function showGame (term) {
  contents = 'What is the Chinese word for <strong>' + term["english"] + '</strong>?';
  $('div#game > p').append(contents);
}

function showHint (term) {
  id = term["sound"].match(/^sound\/(\w+).wav$/);
  contents = '<a href="#" class="audio" id='+id[1]+'><strong>' + term["pinyin"] + '</strong>?</a>';
  $('div#hint > p').append(contents);
}

function clearGameHint () {
  $('div#game > p').text("");
  $('div#hint > p').text("");
}

function selectRandomTerm () {
  var rand = Math.floor(Math.random() * dict.length);
  return dict[rand];
}

// For demo purposes. Should be a server-side look-up.
// Also -- would need both .wav and .mp3 to cover different browsers. .wav does not play in IE,
// but .mp3 does not play in Firefox.
function dictInit() {
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
function syllInit() {
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
function selectChars(term) {
  charlist = [];
  bagochars = [];
  chars = term["chinese"];
  for(i=0;i<chars.length;i++) {
    charlist.push(chars[i]);
  }
  for(i=0;i< dict.length;i++) {
    chars = dict[i]["chinese"];  
    for(j=0;j<chars.length;j++) {
      char = chars[j];
      bagochars.push(char);
      syllIndex = findIndexByKeyValue(syllables,"chinese",char);
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
    for (var i = 0; i < syllables.length; i++) {
        if (syllables[i]["chinese"] === char) {
          id = syllables[i]["sound"][0].match(/^sound\/(\w+).wav$/i);
            return id[1];
        }
    }
    return null;
}

function audioDictInit(dict) {
  audios = [];
  for (i= 0; i < dict.length; i++) {
    addAudioNode(dict[i]);
  }
  
}
// would be easy to randomize between male and female speakers
function addAudioNode(dictItem) {
  audio = document.createElement('audio');
  if (typeof dictItem.sound === "undefined") {
    audio.setAttribute('src',dictItem[0]);
    file = dictItem[0];
  }
  else { 
    audio.setAttribute('src',dictItem.sound);   
    file = dictItem.sound;     
  }
  id = file.match(/^sound\/(.+)\.(mp3|WAV)$/i);
  audio.setAttribute('id',id[1]);
  audio.setAttribute('preload',"auto");
  audio.load();
  audios.push(audio);
}

function playAudio (id) {
  for (i=0;i<audios.length;i++) {
    if (audios[i].getAttribute("id") === id) {      
      audios[i].play();
      break;
    }
  }
}



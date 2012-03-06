#create JSON array from text
library("stringr")

donneOut = "donne.json"
donne = "donne.txt"

shakespeareOut = "shakespeare.json"
shakespeare = "shakespeare.txt"

file = readLines(file(shakespeare,encoding="UTF-8"))
phrases = str_trim(file,side="both")
#phraseCol = cbind(phrases)
#quotedPhrases = gsub("([\"\'])","\\\\1",phraseCol)
#json = c("[",phrases,"]")

#unique(phrases)
#phrases[phrases != ""] 
write(json,file=shakespeareOut)



lex = require("./lex.js")
model = require("./model_v2.js")

const Dictionary = require("./Dictionary")

const dict = new Dictionary()

dict.setWordlist(lex)

let suggestions = dict.getSuggestions("compla")

console.log("'teh' suggestions are " +suggestions);

console.log( dict.completions("mal") );


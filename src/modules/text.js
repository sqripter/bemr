const json_data = require("../../py/.data/model.json")

const THR_CLOSEWORDS = 4;

export default class Text {
    constructor() {
        this.__complaints = json_data.tokens.join()
        this.model = json_data.model;
        window._model_ = json_data.model;

        this.last_word = ""

        this.tokens = json_data.tokens
        this.model = json_data.model
    }

    textEvent(obj) { // this could be a key click
        //console.clear()
        let words = ((__obj) => {
            if (typeof (__obj) == "string") {
    
                // first, if words in multiline, get the last word
                
    
                return  String( __obj.replace(/[,.]/g,"\n").split("\n").slice(-1) )
       
            } else if (__obj instanceof Event) {
                let target = (__obj.path[0] || __obj.target);
                let t = target.matches("textarea") ? target : target.closest("[contenteditable]")
                if (t == undefined) {
                    console.error("Text prediction : No [contenteditable] div found");
                    return "";
                }
                return String(t.textContent)
            }
        })(obj)

        words = words.toLowerCase().trim().split(" ").map(w => w.trim())


        if (!words.length) return[];

        let out = []

        for (let k = 3; k; --k) {

            if (words.length < k) continue;
            const stem = words.slice(-k).join(" ");
            if (stem == "") continue;
            let ckeys = this.closeKeys(stem)
            ckeys.forEach((hint, i) => {
                if (hint == stem) return;

                if (hint.startsWith(stem + " ")){
                    console.log("stem in hint",stem, ",",hint)

                    let l = stem.length;

                    hint = hint.slice(l)

                    console.log("-->[no stem],",hint)

                    out.push({"hint":hint, "stem":""})

                }else{

                out.push( { "hint": hint, "stem": stem } );
                }
                //console.table(obj)
            })
            console.log(ckeys.slice(0, 10));

            if (out.length > 4) break;
        }

        return out

    }

    closeKeys(word) {
        return Object.keys(this.model).filter(key => key.startsWith(word))
    }

}
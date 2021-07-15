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

    textEvent(evt){ // this could be a key click
        // what is the last word
        let target = (evt.path[0]||evt.target);
        let t = target.matches("div,[contenteditable]")?target: target.closest("[contenteditable]")
        if (t == undefined){
            console.error("textEvent : Not [contenteditable] div found");
            return;
        }        
        let words = t.textContent.trim().toLowerCase().split(" ").map(w=>w.trim())

        //
        console.clear()

        if (!words.length)return;

        for (let k = 3; k; --k){
            console.log("Checking ",k)
            if (words.length < k) continue;
            console.log(this.closeKeys( words.slice(-k).join(" ") ))
            
        }

    }
    closeKeys(word){
        return Object.keys(this.model).filter( key => key.startsWith(word) )
    }

}
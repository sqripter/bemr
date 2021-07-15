const json_data = require("../../py/.data/model.json")



export default class Text {
    constructor() {
        this.__complaints = json_data.tokens.join()
        this.model = json_data.model;
        window._model_ = json_data.model;

    }

    complaints() {
        return this.__complaints
    }

    slice_word(lword, pos) {
        let next_stop = this.__complaints.indexOf(",", pos + 1)
        return this.__complaints.slice(pos + 1, next_stop)
    }

    suggest(str) {
        let msg = {}
        console.clear()
        msg["text"] = str

        let words = str.trim()
        if (words.length == 0) return;

        words = words.split(" ")

        let num_words = words.length;
        let lword = words[num_words - 1].toLowerCase()

        msg["last word"] = lword
        msg["num words"] = num_words

        // look for all the words similar to it now
        lword = "," + lword;
        let s = this.__complaints.indexOf(lword);
        let accum = []
        while (s >= 0) {
            accum.push(this.slice_word(lword, s))
            s = this.__complaints.indexOf(lword, s + 1);
        }
        msg["choices"] = accum.join()


        switch (num_words) {
            case 1:// such the model for one word completion
                break;
            case 2:
                break;
                
            default:


        }





        console.table(msg)

        return accum;
    }
}
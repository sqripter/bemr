import '../css/views.css'

import Text from '../../modules/text'

import AbstractView from '../abstract/abstract-view'


//const complaints = ",Vomiting,Cough,Night sweats,Dyspneoa,Fatigue,Chest pain,Abdominal pain,Running nose,Wheezing,Joint pains,Podagra,";
const T = new Text()

const complaints = T.complaints()
export default class Consultation extends AbstractView {
    sections = {
        "pc": `Presenting complaints`,
        "hpc": "History",
        "ge": "General examination",
        "se": "Systems Review" 
    }

    constructor(view) {
        super(view)
    }
    __addEditableDiv(div) {
        const ed = document.createElement("div");
        ed.setAttribute("contentEditable", "true");
        ed.classList.add("tabs__edit__line");
        //ed.textContent  = "."
        div.appendChild(ed)
    }
    __getCaretRng() {
        let sel = window.getSelection();
        if (sel.rangeCount == 0) return undefined;
        let rng = sel.getRangeAt(0);
        return rng
    }
    __keypress(evt) {
        if (evt.keyCode == 13) {
            let node = this.__getCaretRng().endContainer;
            this.__removeSuggestion(node)
        }
    }
    __removeSuggestion(node) {
        // get the sibling
        let j = node.parentElement;
        while (!j.matches(".tabs__edit")) {
            j = j.parentNode;
        }
        let elms = j.getElementsByClassName("tabs__edit--suggestion");
        for (let elm of elms) {
            elm.parentNode.removeChild(elm);
        }
    }

    __func_text() {

        let rng = this.__getCaretRng();
        let node = rng.endContainer;

        let rawtext = node.textContent.toLowerCase();
        let text = rawtext.trim()

        let choices = T.suggest(rawtext)

        if (text.length < 3 || text == ",") {

            this.__removeSuggestion(node);
            return;
        };

        let start = complaints.toLocaleLowerCase().indexOf("," + text);
        let stop = start;


        //what is the node after the node
        let sib = node.nextElementSibling;

        if (start < 0) {
            if (sib != undefined && sib.hasAttribute("suggestion")) { sib.textContent = "" }    
            return

        } else if (start >= 0) {
            stop = complaints.indexOf(",", start + 1);
            
        }

        let suggestion = complaints.slice(start + 1, stop)
        let fragment = suggestion.slice(text.length);

        //console.table({ text: text, suggestion: suggestion, fragment: fragment })


        if (/\s\s$/.test(rawtext)) { // complete the suggestion
            
            node.textContent = suggestion;
            node.parentNode.removeChild(sib);


            let range = document.createRange();
            range.selectNodeContents(node);
            range.collapse(false); // docs : range.collapse(toStart);

            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

        }
        else if (sib != undefined && sib.hasAttribute("suggestion")) {//continue with suggestion
            sib.innerText = fragment
        
        } else { //add the suggestion div
            let sugg = document.createElement("span");
            sugg.classList.add("tabs__edit--suggestion");
            sugg.setAttribute("contentEditable", "false");
            sugg.setAttribute("suggestion", "suggestion");
            node.parentNode.insertBefore(sugg, sib);
            sugg.textContent = fragment;
        }
    }


    repaint(args, view) {
        console.table(args)

        this.view = (view || this.view);

        super.repaint()
        
        const frag = document.createDocumentFragment();

        this.view.innerHTML = "";

        let num = 0;
        for (const section in this.sections) {
            const elm = document.createElement("div");
            elm.classList.add("tabs__consult", "tabs__consult__" + section);

            const caption = document.createElement("div")
            caption.classList.add("tabs__caption")
            caption.textContent = this.sections[section]

            /**/elm.appendChild(caption)


            const edit = document.createElement("div");
            edit.setAttribute("contentEditable", "true");
            edit.classList.add("tabs__edit");
            this.__addEditableDiv(edit)
            /**/elm.appendChild(edit);

            frag.appendChild(elm);

            num += 1;
        }
        this.view.appendChild(frag);


        // adding the components
        this.view.appendChild(document.createElement("my-jacold"))
        this.bboxx = document.createElement("div")
        this.bboxx.classList.add("bboxx")
        //this.bboxx.textContent = "see me"
        this.view.appendChild(this.bboxx)
        //

        this.view.addEventListener("keypress", evt => this.__keypress(evt))
        this.view.addEventListener("keyup", evt => this.__func_text(evt))
        //this.view.addEventListener("mouseup",)


        window.json_data = T.complaints()
    }

}
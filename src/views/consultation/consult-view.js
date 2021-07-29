import styles from "./consult-view.css"

import AbstractView from '../abstract/abstract-view'

import Keyboard from "../kbd/kbd"

//const complaints = ",Vomiting,Cough,Night sweats,Dyspneoa,Fatigue,Chest pain,Abdominal pain,Running nose,Wheezing,Joint pains,Podagra,";

export default class Consultation extends AbstractView {
    sections = {
        "pc": `Presenting complaints`,
        "hpc": "History",
        "ge": "General examination",
        "se": "Systems Review",
        "impression": "Impression",
        "plan": "Plan",
        "meds": "Medication",
        "labs": "Labs & Imaging",
    }

    constructor(view, firedb) {
        super(view)
        this.firedb = firedb;
        this.kbd = new Keyboard(".tab__edit")
        this.navTop = document.createElement("div")
        let btn = document.createElement("button")
        btn.textContent = "Save"
        this.navTop.appendChild(btn)
        btn.addEventListener("click", e => this.saveConsult(e))

    }

    saveConsult(evt) {
        console.log("..Saving")

        let data = {}

        for (const key in this.sections) {
            let value = document.getElementById(`text_${key}`).value
            data[key] = value
        }

        console.table(data)



        evt.stopImmediatePropagation()

    }
    __addEditableDiv(div) {
        const ed = document.createElement("div");
        ed.setAttribute("contentEditable", "true");
        ed.classList.add("tab__edit__line");
        //ed.textContent  = "."
        div.appendChild(ed)
    }
    __getCaretRng() {
        let sel = window.getSelection();
        if (sel.rangeCount == 0) return undefined;
        let rng = sel.getRangeAt(0);
        return rng
    }



    repaint(args, view) {

        this.view = (view || this.view);
        this.current_session = args

        console.log(args)

        super.repaint()

        const frag = document.createDocumentFragment();

        this.view.innerHTML = "";

        let header = `
        <div>
        <button>Save</button>
        </div>
        `

        this.view.appendChild(this.navTop)

        let num = 0;
        for (const section in this.sections) {
            const elm = document.createElement("div");
            elm.classList.add("tab__consults", "tab__consults__" + section);

            const caption = document.createElement("div")
            caption.classList.add("tab__caption")
            caption.textContent = this.sections[section]

            /**/elm.appendChild(caption)


            const edit = document.createElement("textarea");

            edit.id = `text_${section}`
            //edit.setAttribute("contentEditable", "true");
            edit.classList.add("tab__edit", "tab__edit--box-sizing", "consults__textarea")

            // we need to use js :-) to auto resize the textarea vertical
            // ONLY works when keyboard is used.
            edit.addEventListener("input", e => {
                let t = e.path[0];
                if (t.clientHeight < t.scrollHeight) {
                    t.style.height = `${(t.scrollHeight + 10)}px`; // the 10 includes roughly the padding(4+4) and borderwidth(1+1)
                }
            })

            //this.__addEditableDiv(edit)
            /**/elm.appendChild(edit);

            frag.appendChild(elm);

            num += 1;
        }
        this.view.appendChild(frag);

        this.kbd.init()

    }

}
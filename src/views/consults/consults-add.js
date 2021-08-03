import styles from "./consults.css"

import AbstractView from '../abstract/abstract-view'

import Keyboard from "../kbd/kbd"

import db_schema from "../db_schema.json"

//const complaints = ",Vomiting,Cough,Night sweats,Dyspneoa,Fatigue,Chest pain,Abdominal pain,Running nose,Wheezing,Joint pains,Podagra,";

export default class ConsultsAdd {

    static filter_funcs = {
        "uppercase": s => { return new String(s).toUpperCase() },
        "lowercase": s => { return new String(s).toLowerCase() },
        "date()": () => { return new Date().toISOString().split("T")[0] },
        "time()": () => { return new Date().toISOString().split("T")[1].split(":").slice(0,2).join(":") }
    }


    constructor(view, firedb) {
        this.view = view
        this.sections = db_schema.ptable.__collections.consults

        this.firedb = firedb;
        this.kbd = new Keyboard("[textpred]")
        this.navbar = document.createElement("div")
        this.navbar.classList.add("navbar")

        let btn = document.createElement("button")
        btn.textContent = "Save"
        btn.classList.add("navbar__button--right")
        this.navbar.appendChild(btn)
        btn.addEventListener("click", e => this.saveConsult(e))


        this.btnBack = document.createElement("button")
        this.btnBack.textContent = "Back"
        this.btnBack.classList.add("navbar__button--left")


        this.btnBackHref = "/consults/:document_id/listing"

        this.btnBack.setAttribute("datalink", "datalink")
        this.btnBack.setAttribute("href", this.btnBackHref)


        this.navbar.appendChild(this.btnBack)


    }

    parse_href(pattern, args) {
        for (const key in args) {
            pattern = pattern.replace(`:${key}`, args[key])
        }
        return pattern
    }
    readEl(el) {
        return 'value' in el ? el.value : el.textContent || false;
      }

    saveConsult(evt) {
        console.log("..Saving")

        let data = {}

        for (const key in this.sections) {
            let elm = document.getElementById(`${key}`)
            data[key] = key + ":" + this.readEl(elm)
        }

        const pref = this.firedb.collection("ptable").doc(this.current_session["document_id"])

        pref.get().then(doc => {
            if (!doc.exists) {
                alert("That document does not exist")
                return
            }



            pref.collection("consults").get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    console.log("===>", doc.data())

                })

            })

            pref.collection("consults").add(data).then(ref => {
                console.log(ref.id)
            })

            console.table(doc.data())
        })

        evt.stopImmediatePropagation() // of there is a problem

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

        this.view.innerHTML = "";

        this.view.appendChild(this.navbar)


        let href = this.parse_href(this.btnBackHref, args)

        this.btnBack.setAttribute("href", href)

        let num = 0;
        let html = ""
        for (const [key, obj] of Object.entries(this.sections)) {

            html += `
            <${obj.ctrl} id="${key}" placeholder="${obj.title}" ${obj["ctrl-opts"] || ""}>${obj.value ? ConsultsAdd.filter_funcs[obj.value]() : ""}</${obj.ctrl}>
            <br/>
            `
        }

        this.view.innerHTML += `<div class="consult__tabs">${html}</div>`

        document.querySelectorAll(".consult__tabs textarea").forEach(ta =>
            // we need to use js :-) to auto resize the textarea vertical
            // ONLY works when keyboard is used.
            ta.addEventListener("input", e => {
                let t = e.path[0];
                if (t.clientHeight < t.scrollHeight) {
                    t.style.height = `${(t.scrollHeight + 10)}px`; // the 10 includes roughly the padding(4+4) and borderwidth(1+1)
                }
            })
        )



        this.kbd.init()

    }

}
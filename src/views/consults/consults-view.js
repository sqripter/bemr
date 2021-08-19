import styles from "./consults.css"

import AbstractView from '../abstract/abstract-view'

import Keyboard from "../kbd/kbd"

import db_schema from "../db_schema.json"

//const complaints = ",Vomiting,Cough,Night sweats,Dyspneoa,Fatigue,Chest pain,Abdominal pain,Running nose,Wheezing,Joint pains,Podagra,";

export default class ConsultsView {

    static filter_funcs = {
        "uppercase": s => { return new String(s).toUpperCase() },
        "lowercase": s => { return new String(s).toLowerCase() },
        "date()": () => { return new Date().toISOString().split("T")[0] },
        "time()": () => { return new Date().toISOString().split("T")[1].split(":").slice(0, 2).join(":") }
    }


    constructor(view, firedb) {
        this.view = view
        this.schema = db_schema.ptable.__collections.consults

        this.firedb = firedb;
        this.kbd = new Keyboard("[textpred]")

        this.btnBackHref = "/consults/:document_id/listing"

    }

    navbar() {
        return `<div class="navbar">
            <button id="btnBack" class="navbar__button--left" datalink href="/workflow/${this.current_session.document_id}">
                Back
            </button>
    
        </div>`
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


    repaint(args, view) {

        this.view = (view || this.view);
        this.current_session = args

        console.log(args)


        let num = 0;
        let html = ""
        for (const [key, obj] of Object.entries(this.schema)) {

            html += `
            <${obj.ctrl} id="${key}" placeholder="${obj.title}" ${obj["ctrl-opts"] || ""}>${obj.value ? ConsultsView.filter_funcs[obj.value]() : ""}</${obj.ctrl}>
            <br/>
            `
        }

        this.view.innerHTML = this.navbar()
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

        let s = this.view.querySelector("#btnSave")
        s.addEventListener("click", e => this.saveConsult(e))

        this.kbd.init()

    }

}
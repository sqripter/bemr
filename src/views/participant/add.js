import db_schema from "../db_schema.json"

import css from "./add.css"

export default class AddParticipant {

    static filter_funcs = {
        "uppercase": s => { return new String(s).toUpperCase() },
        "lowercase": s => { return new String(s).toLowerCase() }
    }

    constructor(view, firedb) {

        this.firedb = firedb;
        this.view = view;

        this.ptable_flds = {}
        Object.keys(db_schema["ptable"]).filter(key => {
            return (!key.startsWith("__"))
        }).forEach(key => { this.ptable_flds[key] = db_schema["ptable"][key] })


    }

    repaint() {

        let html = ""

        for (const fld in this.ptable_flds) {
            console.log("<>", fld)
            const fld_name = fld

            const fld_title = this.ptable_flds[fld].title;
            const fld_ctrl = this.ptable_flds[fld].ctrl;
            const fld_ctrl_opts = this.ptable_flds[fld]["ctrl-opts"] || "";


            html += `
            <div class="add__ctrl">
                    <${fld_ctrl} 
                    id="${fld_name}"
                    placeholder="${fld_title}"
                    
                    ${fld_ctrl_opts}

                    ></${fld_ctrl}>
            </div>`

            this.view.innerHTML = html + `<div class="fab fab--right" datalink href="/search" >Save<div>`
            this.view.innerHTML += `<div class="fab fab--left" datalink href="/search" ><-</div>`
        }


        this.view
            .querySelector(".fab--right,[datalink][href='/search']")
            .addEventListener("click",
                (function (__this) { return function (evt) { __this.btnSaveClick(evt, __this) } })(this)
            )// this.clickClosure(this) ) 


    }


    db_ptable(func) {
        this.firedb.collection("ptable")
            .get()
            .then(snapshot => {
                func(snapshot);

                var source = ss.metadata.fromCache ? "local cache" : "server";
                console.log("Data came from " + source);

            })
    }

    btnSaveClick(evt, __this) {
        let num_errors = 0;
        const npart = {};


        for (const fld in this.ptable_flds) {
            let error_str = [];

            const finfo = this.ptable_flds[fld];

            let view = document.getElementById(fld)

            let value = view.value.trim();

            if ((finfo["required"] && finfo["required"] == true) && value.length == 0) {
                num_errors += 1;
                error_str.push("This value is required")
            }

            if (finfo["regex"]) {
                let regex = finfo.regex;
                if (!new RegExp(regex).test(value)) {
                    num_errors += 1;
                    error_str.push(`The ${finfo.title} entered failed the regex match: ${regex}`)
                }
            }

            if (finfo["filters"]) {

                const ops = finfo["filters"].split("|")
                for (const op of ops) {
                    value = AddParticipant.filter_funcs[op](value)
                }

            }

            view.setAttribute("error", error_str.join("|"))
            view.value = value

            npart[fld] = value
        }

        if (num_errors > 0) {

            evt.stopImmediatePropagation();
            return;

        }

        this.firedb.collection("ptable").add(npart).then(ref => {
            console.clear();

            console.log("Added the doc with the ref %s", ref.id);

            console.table(npart);
        })


    }

}

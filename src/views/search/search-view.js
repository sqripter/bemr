import {html} from "lit"
import css from "./search-view.css"
import css_table from "./../css/table.css"
import db_schema from "../db_schema.json"
export default class Search {
    constructor(view, firedb) {
        
        this.view = view
        this.firedb = firedb;

        this.ptable_flds = {}
        Object.keys(db_schema["ptable"]).filter(key=>{
            return (!key.startsWith("__")) 
        }).forEach(key=>{ this.ptable_flds[key] = db_schema["ptable"][key] })

    
        this.html_header = `

        <div class="nav--bar">
            <input size="14" maxlength="14" class="nav--bar__widget" type="text" placeholder="Participant id."></input>
            <button class="nav--bar__widget">Expected today</button>
            <lable class="nav--bar__widget" for="datepicker">Visit date
                <input id="datepicker" min="2020-01-01" max="2030-12-31" type="date"></input>
            <lable>
        </div>`
    }


    repaint() {
        this.view.innerHTML = this.html_header;

        const frag = document.createDocumentFragment();
        const table = document.createElement("table")
        frag.appendChild(table);


        const func = (snapshot) => {

            let html = [`<table class="content-table">`];

            html.push("<thead><tr>")
            
            Object.keys(this.ptable_flds).forEach(key=>{
                
                const field = this.ptable_flds[key].title.trim()
                 html.push(`<th>${ field }</th>`)
            
            })

            html.push("</tr></thead>")

            snapshot.forEach(doc => {
                html.push(`<tr href="/workflow/${doc.id}" >`)
                const data = doc.data();
                Object.keys(this.ptable_flds).forEach(key=>{
                    html.push(`<td datalink >${data[key]}</td>`)
                })

                html.push("</tr>")
                html.push("<tr role='search-more'><td colspan=4>&nbsp;</td></tr>")

            });
            html.push("</table>")
            this.view.innerHTML+= html.join("") + this.fab()
        }


        this.db_ptable( func );
                
    }


    fab() {
        return `
        
            <div class="fab fab--right" datalink href="/pnew" >+</div>
        
        `
    }

    db_ptable(func){
        this.firedb.collection("ptable")
        .get()
        .then(snapshot=>{
            func(snapshot);
        })
    }
}


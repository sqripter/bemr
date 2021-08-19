import css_tabs from "./../../views/css/views.css"
import css_widget from "./../../views/css/widget.css"
import css from "./workflow.css"
import css_table from "./../css/table.css"

class AddConsult {
    constructor(doc_id, view, caller) {
        this.view = view
        this.doc_id = doc_id
        this.caller = func_repaint

        this.repaint()
    }
}

export default class Workflow {
    constructor(view, firedb) {

        this.firedb = firedb;
        this.view = view

        this.tabs = {
            "Visits":
                { "List": "/consults/:document_id/listing", "Add": "/consults/:document_id/add" },
            "Conmeds":
                { "List": "/conmeds/"},
            "AEs": 
                { "List": "/aes/" }
        }
    }


    __show() {
        this.firedb.collection("users")
            //.where("name","==","Aimee")
            .get()
            .then(
                (ss) => {
                    ss.forEach(s => console.table(s.data()))

                    var source = ss.metadata.fromCache ? "local cache" : "server";
                    console.log("Data came from " + source);
                });

    }

    parse_href(pattern,args){
        for (const key in args){
            pattern = pattern.replace (`:${key}`, args[key]  )
        }
        return pattern
    }


    repaint(args,view) {
        this.args = args
        this.view = view || this.view

        this.current_session = args

        let html = []

        for (const [tabName,tablets] of Object.entries(this.tabs)) {

            html.push( `<div class="widget__container" > <div class="widget__heading widget--look app--bgcolor"> ${tabName} </div>
                ${Object.entries(tablets).map( (array)=>{ 

                    let href = this.parse_href( array[1]   ,this.current_session)

                    return `<a  datalink  class="widget__option widget--look" href="${  href  }">${array[0]}</a>`
                }).join("")}
            </div>`)

        }

        this.view.innerHTML = this.navbar() + html.join("")

    }

    navbar() {

        return `        
        <div class="navbar">
        <button id="btnBack" class="navbar__button--left" datalink href="/search">
            Back
        </button>
    </div>
    <span> Participant ${this.current_session.document_id} </span>&nbsp;<span>${this.current_session.document_id}</span>
    `
    }

}

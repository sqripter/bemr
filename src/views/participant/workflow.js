import css_tabs from "./../../views/css/views.css"
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

        this.elements = {
            main: null,
            navbar: null,
            viewport: null
        }
        this.props = {
            __thrXmove: 32,
            scroll_value: 0,
            tab_width: 0,
            tabOffset0: -1,
            touchStartX: -1,
            tabIndex: 0,
            num_tabs: 0
        }
        this.tabs = {
            "Visits":
                { "default": "/consults/:document_id/listing", "Add": "/consults/:document_id/add" },
            "Conmeds":
                { "default": "/conmeds/"},
            "AEs": 
                { "default": "/aes/" }
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


    repaint(args) {
        this.args = args

        this.elements.main = document.createDocumentFragment();

        this.elements.navbar = document.createElement("div");
        this.elements.navbar.classList.add("navbar");
        this.elements.viewport = document.createElement("div");
        this.elements.viewport.classList.add("viewport");

        this.elements.main.appendChild(this.elements.navbar);
        this.elements.main.appendChild(this.elements.viewport );

        for (const tabName in this.tabs) {

            let div = document.createElement("div")


            let a = document.createElement("button");
            a.textContent = tabName;
            a.setAttribute("href",  this.parse_href( this.tabs[tabName]["default"] ,args) )
            a.setAttribute("datalink","datalink")

            div.appendChild(a);

            let other_links = Object.keys(this.tabs[tabName]).filter(k => k != "default")

            for (const o of other_links){
                let a2 = document.createElement("button")
                a2.textContent = o;
                a2.setAttribute("href", this.parse_href( this.tabs[tabName][o],args) )
                a2.setAttribute("datalink", "da")

                div.appendChild(a2)
            }

            this.elements.viewport.appendChild(div)

        }

        this.view.innerHTML = ""
        this.view.appendChild(this.elements.main);


    }

    fillVisits() {
        const tab = this.tabs["Visits"];
        tab.innerHTML = "showing results for " + this.args["document_id"]

        tab.append(this.fab())
    }

    fab() {
        let html = `<div class="fab fab--right" tablink href="/consults/${this.args.document_id}" >+Visit</div>`
        const template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

}

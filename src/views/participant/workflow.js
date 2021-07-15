import css_tabs from "./../../views/css/views.css"
import css from "./workflow.css"
import css_table from "./../css/table.css"

class AddConsult{
    constructor(doc_id, view,caller){
        this.view = view
        this.doc_id  = doc_id
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
            tabs: null
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
        this.tabs = { "Visits": {}, "Conmeds": {}, "AEs": {} }

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
    evtTouchStart(evt) {
        this.props.touchStartX = evt.changedTouches[0].screenX;

    }
    evtTouchEnd(evt) {
        if (this.props.touchStartX < 0) return;

        let tx = evt.changedTouches[0].screenX;

        let dist = tx - this.props.touchStartX;

        if (dist > this.props.__thrXmove) {
            this.props.tabIndex -= 1;

        } else if (dist < -this.props.__thrXmove) {
            this.props.tabIndex += 1;
        }
        this.__snapToTab(this.props.tabIndex);
    }
    evtButtonClicked(evt) {
        let btn = evt.target;
        this.__snapToTab(Array.from(btn.parentNode.children).indexOf(btn));
    }
    __tabByIndex(i) {
        return this.elements.tabsContainer.children[i];
    }
    __snapToTab(i) {
        if (i < 0) {
            this.props.tabIndex = 0;
        } else if (i >= this.props.num_tabs) {
            this.props.tabIndex = this.props.num_tabs - 1;
        } else {
            this.props.tabIndex = i;
        }

        let w = this.props.tabOffset0 >= 0 ? this.props.tabOffset0 : this.elements.tabsContainer.children[0].offsetLeft;

        this.elements.tabsContainer.scrollLeft = this.elements.tabsContainer.children[i].offsetLeft - w;

    }
    get(index) {
        return this.elements.tabsContainer.children[index];
    }

    repaint(args) {
        this.args = args

        this.elements.main = document.createDocumentFragment();

        this.elements.navbar = document.createElement("div");
        this.elements.navbar.classList.add("navbar");

        this.elements.tabsContainer = document.createElement("div");
        this.elements.tabsContainer.classList.add("tabs__container");

        this.elements.main.appendChild(this.elements.navbar);
        this.elements.main.appendChild(this.elements.tabsContainer);

        for (const tabName in this.tabs) {

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.textContent = tabName;
            button.classList.add("navbar__button");
            button.addEventListener("click", evt => { this.evtButtonClicked(evt) });
            this.elements.navbar.appendChild(button);

            const tab = document.createElement("div");
            this.tabs[tabName] = tab
            tab.classList.add("tab","tab__"+tabName.toLowerCase());
            tab.setAttribute("viewport","")

            // remove after debug
            tab.innerHTML = "<div>" + tabName + "</div>";
            // \remove

            this.elements.tabsContainer.appendChild(tab);
            this.props.num_tabs += 1;

        }
        this.elements.tabsContainer.addEventListener("touchstart", (evt) => { this.evtTouchStart(evt) });
        this.elements.tabsContainer.addEventListener("touchend", (evt) => { this.evtTouchEnd(evt) });

        this.view.innerHTML = ""
        this.view.appendChild(this.elements.main);

        this.fillVisits();

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

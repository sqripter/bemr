import { firedb } from "./modules/dbase/fire"
import { Jacold } from "./views/lit-components/jacold";
import { TextInput } from "./views/lit-components/input"
import { RadioSelect } from "./views/lit-components/radioselect"

import ConsultsAdd from "./views/consults/consults-add"
import ConsultsList from "./views/consults/consults-list";
import Login from "./views/login/login-view";
import Search from "./views/search/search-view";
import AddParticipant from "./views/participant/add"
import Workflow from "./views/participant/workflow"

let debug_landing = "/workflow/docid_XXXYYY234"
//debug_landing = "/consults/docid"
debug_landing = "/search"

const __history = {

  pushState(a, viewport, link) {
    this.links.push(link);
    this.location = link;
    this.viewport = viewport;

  },
  location: debug_landing,
  links: [],
  popState() {
    if (this.links.length > 1) {
      this.location = this.links.pop()
    }
  }
}

const pathToRegex = p => new RegExp("^" + p.replace(/\//g, "\\/").replace(/:\w+/g, "\(.+\)") + "$");

class App {
  init() {
    this.fdb = firedb();
    this.body = document.body;

    this.consults_add = new ConsultsAdd(this.body,this.fdb);
    this.consults_list = new ConsultsList(this.body,this.fdb);
    this.search = new Search(this.body, this.fdb);
    this.login = new Login(this.body, this.fdb);
    this.addParticipant = new AddParticipant(this.body, this.fdb);
    this.workflow = new Workflow(this.body, this.fdb)

    //this.addParticipant.repaint()
    //this.login.repaint()

    this.routes = [
      { path: "/search", view: this.search },
      { path: "/login", view: this.login },
      { path: "/pnew", view: this.addParticipant },
      { path: "/workflow/:document_id", view: this.workflow },
      { path: "/consults/:document_id/listing", view:this.consults_list},
      { path: "/consults/:document_id/:action", view:this.consults_add},

    ]

  }

  clicks(evt) {
    let target = evt.path[0];
    if (target.matches("a[datalink]")) {
      evt.preventDefault();
    }

    if (!target.matches("[datalink],[tablink]")){
      return
    }

    let elm = target.hasAttribute("href") ? target : target.parentElement;

    let href= elm.attributes["href"].nodeValue;


    if (target.matches("[datalink]")) {
      __history.pushState(null, null, href);
    } else if (target.matches("[tablink]")) {
      let viewport = target.closest("[viewport]");
      __history.pushState(null, viewport, href)
    }
    this.router()
  }


  router() {
    let route = this.routes.find(route => {

      let regex = pathToRegex(route.path);

      return (regex.test(__history.location))
    });

    if (route === undefined) {
      route = { path: debug_landing, view: this.search }

    }
    

    const regex = pathToRegex(route.path);
    let params = regex.exec(route.path).slice(1)
    let vals = regex.exec(__history.location).slice(1)

    const args = {}

    for (let i = 0; i < params.length; ++i) {
      args[params[i].slice(1)] = vals[i]
    }

    console.table(args)
    route.view.repaint(args,__history.viewport);

  }

}


document.addEventListener("DOMContentLoaded", function () {

  window.app = new App();

  app.init()

  //window.addEventListener("popstate", e=> app.router(e) )

  document.addEventListener("click", e => app.clicks(e))

  app.router()

})


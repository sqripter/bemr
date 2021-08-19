import db_schema from "../db_schema.json"

export default class ConsultsList {
    constructor(view, fdb) {
        this.fdb = fdb;
        this.view = view;
        this.schema = db_schema.ptable.__collections.consults
    }

    repaint(args, view) {

        this.view = view || this.view

        this.current_session = args



        this.fdb.doc(`ptable/${this.current_session.document_id}`).get().then(doc => {

            doc.ref.collection("consults").get().then(s => {

                let html = [`<table class="content-table app--bgcolor">`];

                html.push("<thead><tr>")

                this.schema.__tableview_fields.forEach(fld => {

                    html.push(`<th>${ this.schema[fld].title  }</th>`)

                })

                html.push("</tr></thead>")

                s.docs.forEach(consult => {

                    //consult.ref.delete()

                    console.log("consult id", consult.id)

                    let data = consult.data()

                    html.push(`<tr href="/consults/${doc.id}/${consult.id}/view" >`)
                    this.schema.__tableview_fields.forEach(fld => {

                        html.push(`<td datalink>${data[fld]}</td>`)
                    })

                    html.push("</tr>")

                })

                this.view.innerHTML = this.navbar(doc) + html.join("")

            })


        })


    }

    navbar(doc) {
        let data = doc.data()
        return `

        <div class="navbar">
            <button id="btnBack" class="navbar__button--left" datalink href="/workflow/${this.current_session.document_id}">
                Back
            </button>
        </div>
        <span> Visits for participant ${data.p_name} </span>&nbsp;<span>${data.p_id}</span>
        
        `
    }
}
export default class ConsultsList{
    constructor(view,fdb){
        this.fdb = fdb;
        this.view = view;
    }

    repaint(args, view){

        this.view = view || this.view

        this.current_session = args

        this.fdb.doc(`ptable/${this.current_session.document_id}`).get().then( doc =>{

            console.log("Listing vistis for ", doc.id)

            doc.ref.collection("consults").get().then (s => {
                s.docs.forEach( consult => {
                    console.log("consult id", consult.id)

                    let data = consult.data()

                }   )
            })


        })

    }

    header_html(){
        return`
        <div class="nav--bar">
            <span> Visits for participant ${this}
        </div>`
    }
}
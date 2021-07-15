export default class Visits {
    constructor(view, firedb, pid){
        this.view = view
        this.firedb = firedb;
        this.pid = pid
    }

    repaint (pid){
        //get the collection of visits
        
    }
    db_visits(){
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
}
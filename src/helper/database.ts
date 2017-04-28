J.HELPER.DATA = {};
new class JHCR_HELPER_DATABASE_CONTROLLER {
    constructor(){
        J.HELPER.magic = function(){
            var killed = false;
            function JHCR_MagicObject(){
                var db = Object.create({}),
                    sets=[]
                    db.__proto__.onSet = []
                Object.defineProperty(db.__proto__, "set",{
                    get () {
                        return sets
                    },
                    set (e) {
                        sets.push(e)
                        configProp(db, e)
                    }
                });
                return db
            }
            function configProp(obj, prop) {
                var i, db = JHCR_MagicObject()                    
                if(!obj.__proto__[prop]){
                    Object.defineProperty(obj.__proto__, prop,{
                        get () {
                            return db
                        },
                        set (e) {
                            if(!killed){
                                console.log("killing "+prop)
                                killed = true;
                                for(i in db.set) {
                                    killData(db, db.set[i]);
                                }
                                killed = false;
                            }
                            db.onSet.forEach(function(cb) {
                                cb({
                                    oldValue: db.__proto__.value,
                                    value: e
                                });
                            });
                            db.__proto__.value = e
                            if(typeof e === "object") {
                                for(i in e) {
                                    if(!db[i]){db.set = i}
                                    db[i] = e[i]
                                }
                            }
                        }
                    });
                }
            }
            function killData(obj, data) {
                var i;
                obj[data]="";
                for(i in obj[data].set) {
                    killData(obj[data], obj[data].set[i]);
                }
            }
            return JHCR_MagicObject();
        }
    }
}
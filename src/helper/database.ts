J.HELPER.DATA = {};
new class JHCR_HELPER_DATABASE_CONTROLLER {
    constructor(){
        J.HELPER.magic = function(){
            function JHCR_MagicObject(){
                var db = Object.create({}),
                    litter,
                    sets=[]
                    db.__proto__.value = ""
                    db.__proto__.onSet = []
                Object.defineProperty(db.__proto__, "set",{
                    get () {
                        return sets
                    },
                    set (e) {
                        sets.push(e)
                        configProp(db, e)
                        db.__proto__.value = e
                    }
                });
                return db
            }
            function configProp(obj, prop) {
                var db = JHCR_MagicObject(),
                    i,
                    isObj=false,
                    storage
                if(!obj.__proto__[prop]){
                    Object.defineProperty(obj.__proto__, prop,{
                        get () {
                            return db
                        },
                        set (e) {
                            db.onSet.forEach(function(cb) {
                                cb({
                                    oldValue: db.__proto__.value,
                                    value: e
                                });
                            });
                            db.__proto__.value = e
                            if(typeof e === "object") {
                                isObj=true
                                for(i in e) {
                                    if(!db[i]){db.set = i}
                                    db[i] = e[i]
                                }
                            } else {
                                isObj=false
                            }
                        }
                    });
                }
            }
            return JHCR_MagicObject();
        }
    }
}
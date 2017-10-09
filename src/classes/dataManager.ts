import { helper } from './helper/helper'

export class dataManager {
    constructor(){
    }

    init= () => {
        return this.dataObject();
    }
    dataObject = () =>{
        var killed = false,
        customObject = () =>{
            var db = Object.create({}),
                sets = []
                db.__proto__.onSet = this.sets()
            Object.defineProperty(db.__proto__, "set",{
                get () {
                    return sets
                },
                set (e) {
                    if(typeof e === "string") {
                        sets.push(e)
                        configProp(db, e, "")
                    }
                    if (e.constructor === Array){
                        debugger
                    } else if (typeof e === "object"){
                        for(let i in e) {
                            sets.push(i)
                            configProp(db, i, e[i])
                        }
                    }
                }
            });
            return db
        },
        configProp = (obj, prop, value) => {
            let i, db = customObject()                    
            if(!obj.__proto__[prop]){
                Object.defineProperty(obj.__proto__, prop,{
                    get () {
                        return db
                    },
                    set (e) {
                        if(!killed){
                            killed = true;
                            for(i in db.set) {
                                killData(db, db.set[i]);
                            }
                            killed = false;
                        }
                        db.onSet.forEach(function(cb, key) {
                            cb({
                                oldValue: db.__proto__.value,
                                value: e
                            }, key);
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
            obj[prop] = value
        },
        killData = (obj, data) => {
            var i;
            obj[data]="";
            for(i in obj[data].set) {
                killData(obj[data], obj[data].set[i]);
            }
        }
        return customObject();
    }
    sets () {
        let set = Object.create({})
        set.__proto__.push = (f) => {
            let guid = this.guid()
            set[guid] = f
            return guid
        }
        set.__proto__.forEach = (cb) => {
            var keys = Object.keys(set)
            keys.forEach(key => {
                cb(set[key], key)
            })
        }
        return set
    }
    guid = new helper().guid 
}
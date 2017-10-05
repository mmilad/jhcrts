import { elemConfig, elemRegisterConfig, elemTypeConfig } from './../interfaces/elem'
import { dataManager } from './dataManager'

export class elementManager {
    element
    types = {}
    registry = {}

    constructor() {
        for(let i in this.protos) {
            this.init[i] = this.protos[i]
        }
    }

    init = (config:any, data?) => {
        let element
        if(typeof config === "string") {config={tag:config}}

        if(config.types) {
            config.types.forEach(function(t){
                for(let i in this.types[t]) {
                    config[i] = this.types[t][i]
                }
            })
        }

        if(config.type) {
            for(let i in config.types[config.type]) {
                if(!config[i]) config[i] = config.types[config.type][i]
            }
        }

        config.tag = !config.tag ? 'div' : config.tag
        if(config.tag === "textNode") {
            element = document.createTextNode('')
        } else {
            element = config.element ? config.element : document.createElement(config.tag)
        }
        !config.value ? false : element.value = config.value
        !config.html ? false : element.innerHTML = config.html
        !config.class ? false : element.className = config.class

        for(let i in config) {
            if(this.render[i]) this.render[i](config[i], element, data)
        }

        return element
    }
    watchElements = () => {
        var dm = new dataManager()
        let that = this, JHCRdocObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation:any) {
                for(var i in mutation.addedNodes) {
                    if(that.registry[mutation.addedNodes[i].localName]) {
                        if(that.registry[mutation.addedNodes[i].localName].data) {
                            var db = dm.init();
                            db.set="data";
                            db.data = that.registry[mutation.addedNodes[i].localName].data
                            Object.defineProperty(mutation.addedNodes[i], "data", {
                                get() {
                                    return db.data;
                                },
                                set(e) {
                                    db.data = e;
                                }
                            });
                        }
                        mutation.addedNodes[i].fa = mutation.addedNodes[i].findAll = mutation.addedNodes[i].querySelectorAll;
                        mutation.addedNodes[i].f = mutation.addedNodes[i].find = mutation.addedNodes[i].querySelector;
                        let tplElement = that.init(that.registry[mutation.addedNodes[i].localName].tpl, mutation.addedNodes[i].data)
                        let x = that.getComponentData(mutation.addedNodes[i], that.registry[mutation.addedNodes[i].localName].interface)
                        console.log(x)
                        mutation.addedNodes[i].appendChild(tplElement)
                        if(that.registry[mutation.addedNodes[i].localName].onSet) {
                            that.registry[mutation.addedNodes[i].localName].onSet(mutation.addedNodes[i]);
                        }
                    }
                }
                for(let i in mutation.removedNodes) {
                    if(that.registry[mutation.removedNodes[i].localName] && that.registry[mutation.removedNodes[i].localName].onRemove) {
                        that.registry[mutation.removedNodes[i].localName].onRemove(mutation.removedNodes[i]);
                    }
                }
            });
        });
        JHCRdocObserver.observe(document, { childList:true, subtree:true});
    }
    getComponentData(e, intf) {
        let o = {}
        if(e.children.length) { 
            if(e.children[0].tagName === "SET-DATA") {
                for(let i in intf) {
                    o[i] = this.getDataAs[intf[i].type]( e.children[0], i, intf[i].item )
                }
            }
        }
        o
        console.log(o)
        debugger
    }
    // buildComponentData(m, type, item) {
    //     let i, obj = {}, data
    //     for(i in item) {
    //         data = m.getElementsByTagName(i)
    //         if(data.length) {
    //             obj[i] = this.getDataAs[type](m, item[i].type, item[i].item)
    //         }
    //     }
    //     console.log(obj)
    //     return obj
    // }
    getDataAs = {
        array: (m, key, intf) => {
            let obj = [], data, item
                data = m.getElementsByTagName(key)
                if(data.length) {
                    for (var e = 0; e < data.length; e++) {
                        item = this.getDataAs["object"](data[e], null, intf)
                        if(item) {obj.push(item)}
                    }
                } else {
                    item = this.getDataDefault["object"](intf)
                    if(item) {obj.push(item)}
                }
            return obj
        },
        object: (m, key, intf) => {
            let obj = {}, data, item
            for(let i in intf) {
                data = m.getElementsByTagName(i)
                if(data.length) {
                    for (var e = 0; e < data.length; e++) {
                        obj[i] = this.getDataAs[intf[i].type](data[e], i, intf[i].item)
                    }
                } else {
                    item = this.getDataDefault[intf[i].type](intf[i].item) 
                    if(item) {obj[i] = item} 
                }
            }
            return obj
        },
        string: (data, key, intf) => {
            if(data) {
                return data.innerHTML
            }
            return this.getDataDefault["string"](intf)
        }
    }
    getDataDefault = {
        array: (intf) => {
            debugger
            let i, empty, check, obj = [], item = {}
            for (i in intf) {
                item = this.getDataDefault["object"](intf)
                if(check) {
                    item = check
                    empty = false
                }
            }
            // check if obj is empty
            if(item) {obj.push(item)}
            return obj.length ? obj : false
        },
        object: (intf) => {
            let i, isSet = false, check, item = {}
            for (i in intf) {
                item[i] = this.getDataDefault[intf[i].type](intf[i].item)
            }
            return item

        },
        string: (intf) => {
            return intf
        }
    }
    getValueOf = (path, obj) => {
        return path.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : undefined
        }, obj || self)
    }
    render = {
        attributes: (config, elem) => {
            for(let i in config) {
                elem.setAttribute(i, config[i])
            }
        },
        properties: (config, elem) => {
            let that = this
            for(let i in config) {
                elem[i] = config[i]
            }
        },
        children: (config, elem, dataModel) => {
            let that = this
            config.forEach(function(i){
                elem.appendChild(that.init(i, dataModel))
            })
        },
        callbacks: (config, elem) => {
            let that = this
            config.forEach(function(i){
                elem.addEventListener(i.event, i.callback)
            })
        },
        binds: (config, elem, d) => {
            let that = this
            function setVals(config) {
                config.forEach((i) => {
                   let data = that.getValueOf(i.data, d)
                    if(i.property) {
                        elem[i.property] = data.value
                        data.onSet.push((d) => elem[i.property = d.value])
                    }
                    if(i.attribute) {
                        elem.setAttribute(i.attribute, data.value)
                        data.onSet.push((d) => elem.setAttribute(i.attribute, d.value))
                    }
                    if(i.callback) {
                        i.callback(i.data.value)
                        data.onSet.push(i.callback)
                    }
                })
            }
            setVals(config)
            // config.data.onSet.push(function(e){
            //     setVals(config)
            // })
        }
    }

    protos = {
        register: (config: elemRegisterConfig)  => {
            for(let i in config) {
                this.registry[i] = config[i];
            }
        },
        addType: (config: elemTypeConfig) => {
            for( var t in config) {
                this.types[t] = config[t]
            }
        }
    }
}

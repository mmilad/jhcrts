import { elemConfig, elemRegisterConfig, elemTypeConfig } from './../interfaces/elem'
import { dataManager } from './dataManager'
export class elementManager {
    element
    types = {}
    registry = {}
    mergeDeep
    constructor(h) {
        this.mergeDeep = h.merge
        // this.mergeDeep = h.merge.dm
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
        } else if(config.tag === "placeHolder") {
            element = document.createTextNode('')
            config.tpl.placeHolder = element
            this.init(config.tpl, data)
        } else {
            element = config.element ? config.element : document.createElement(config.tag)
        }

        if(config.if) {
            let d = this.getValueOf(config.if, data)
            if(d.value.length) {
                let cb = () => {
                    config.placeHolder.replaceWith(element)
                    config.placeHolder.removeEventListener('DOMNodeInserted', cb)
                }
                config.placeHolder.addEventListener('DOMNodeInserted', cb)
            }
            d.onSet.push(e => {
                if(e.value.length) {
                    config.placeHolder.replaceWith(element)
                } else {
                    element.replaceWith(config.placeHolder)
                }
            })
        }
        if(config.for) {
            console.log(config.for.data)
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
                mutation.addedNodes.forEach(m =>{
                    if(that.registry[m.localName]) {
                        var db = dm.init();
                        db.set="data";
                        if(!that.registry[m.localName].defaultData) {
                            that.registry[m.localName].defaultData = that.getDefaultData(that.registry[m.localName].interface)
                        }
                        if(m.data) {
                            db.data = that.mergedDefaultData(m.data, that.registry[m.localName].defaultData)
                        } else {
                            db.data = that.getComponentData(m, that.registry[m.localName].interface)
                        }
                        Object.defineProperty(m, "data", {
                            get() {
                                return db.data;
                            },
                            set(e) {
                                db.data = e;
                            }
                        });
                        let tplElement = that.init(that.registry[m.localName].tpl, m.data)
                        if(m.childNodes[0]) {
                            m.insertBefore(tplElement, m.childNodes[0])
                        } else {
                            m.appendChild(tplElement)
                        }
                        if(that.registry[m.localName].onSet) {
                            that.registry[m.localName].onSet(m);
                        }
                    }
                })
                mutation.removedNodes.forEach(m => {
                    if(that.registry[m.localName] && that.registry[m.localName].onRemove) {
                        that.registry[m.localName].onRemove(m);
                    }
                })
            });
        });
        JHCRdocObserver.observe(document, { childList:true, subtree:true});
    }
    getDefaultData(intf) {
        let o = {}
        for(let i in intf) {
            o[i] = this.getDataDefault[intf[i].type](intf[i].item )
        }
        return o
    }
    mergedDefaultData(data, intf) {
        let o = data, defaultData = intf
        return this.mergeDeep(defaultData, o)
    }

    getComponentData(e, intf) {

        let o = {}, setData = e.getElementsByTagName('set-data')
        if(setData.length) {
            setData = setData[0]
            for(let i in intf) {
                if(intf[i].type === "string") {
                    o[i] = this.getDataAs[intf[i].type]( setData.getElementsByTagName(i)[0], i, intf[i].item )
                } else {
                    o[i] = this.getDataAs[intf[i].type]( setData, i, intf[i].item )
                }
            }
            setData.remove()
        } else {
            o = this.getDefaultData(intf)
        }
        return o
    }
    hasValues(o) {
        let hasItem = false
        for(let i in o) {
            if(o[i]) {hasItem = true}
        }
        return hasItem
    }
    getDataAs = {
        array: (m, key, intf) => {
            let obj = [], data, item
                data = m.getElementsByTagName(key)
                if(data.length) {
                    for (var e = 0; e < data.length; e++) {
                        item = this.getDataAs["object"](data[e], null, intf)
                        if(this.hasValues(item)) {
                            obj.push(item)
                        }
                    }
                } else {
                    item = this.getDataDefault["object"](intf)
                    if(this.hasValues(item)) {
                        obj.push(item)
                    }
                }
            return obj
        },
        object: (m, key, intf) => {
            let obj = {}, data, item
            for(let i in intf) {
                data = m.getElementsByTagName(i)
                if(data.length) {
                    for (var e = 0; e < data.length; e++) {
                        if(intf[i].type === "array") {
                            obj[i] = this.getDataAs[intf[i].type](m, i, intf[i].item)
                        } else {
                            obj[i] = this.getDataAs[intf[i].type](data[e], i, intf[i].item)
                        }
                    }
                } else {
                    obj[i] = this.getDataDefault[intf[i].type](intf[i].item)
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
            let i, empty, check, obj = [], item = {}
            for (i in intf) {
                item = this.getDataDefault["object"](intf)
            }
            if(this.hasValues(item)) {
                obj.push(item)
            }
            return obj
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
                        data.onSet.push((d) => {
                            elem[i.property] = d.value
                        })
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

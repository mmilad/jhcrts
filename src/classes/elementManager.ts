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
        var element = config.element ? config.element : document.createElement(config.tag)
        element.data = data 
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
                        var tplElement = that.init(that.registry[mutation.addedNodes[i].localName].tpl, mutation.addedNodes[i].data)
                        mutation.addedNodes[i].innerHTML = ""
                        mutation.addedNodes[i].appendChild(tplElement)
                        mutation.addedNodes[i].f = mutation.addedNodes[i].find = mutation.addedNodes[i].querySelectorAll;
                        if(that.registry[mutation.addedNodes[i].localName].onSet) {
                            that.registry[mutation.addedNodes[i].localName].onSet(mutation.addedNodes[i]);
                        }
                    }
                }
                for(var i in mutation.removedNodes) {
                    if(that.registry[mutation.removedNodes[i].localName] && that.registry[mutation.removedNodes[i].localName].onRemove) {
                        that.registry[mutation.removedNodes[i].localName].onRemove(mutation.removedNodes[i]);
                    }
                }
            });
        });
        JHCRdocObserver.observe(document, { childList:true, subtree:true});
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

                if(i.tag === "textNode") {
                    var content = i.html.split(/\s*(\{\{[^}]+}})\s*/).filter(Boolean);
                    content.forEach((item, index) => {
                        let str
                        if(item.match(/{{(.*?)}}/)) {
                            str = item.replace(/{{|}}|\s/g, "")
                            let selectedData = that.getValueOf(str, dataModel)
                            str = document.createTextNode(selectedData.value)
                            selectedData.onSet.push(v => {str.nodeValue = v.value})
                            
                        } else {
                            str = document.createTextNode(item)
                        }
                        if(index !== content.length) str.nodeValue += " " 
                        elem.appendChild(str)
                    })
                } else {
                    elem.appendChild(that.init(i, dataModel))
                }
            })
        },
        callbacks: (config, elem) => {
            let that = this
            config.forEach(function(i){
                elem.addEventListener(i.event, i.callback)
            })
        },
        binds: (config, elem) => {
            let that = this
            function setVals(config) {
                config.forEach((i) => {
                   let data = that.getValueOf(i.data, elem.data)
                    if(i.property) {
                        elem[i.property] = data.value
                        data.onSet.push((d) => elem[i.property = d.value])
                    }
                    if(i.attribute) {
                        elem.setAttribute(i.attribute, that.getValueOf(config.data, elem.data))
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

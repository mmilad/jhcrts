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

    init = (config:any) => {

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
        var element = config.element = document.createElement(config.tag) 
        !config.value ? false : element.value = config.value
        !config.html ? false : element.innerHTML = config.html
        !config.class ? false : element.className = config.class

        for(let i in config) {
            if(this.render[i]) this.render[i](config[i], element)
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
                        var tplElement = that.init(that.registry[mutation.addedNodes[i].localName].tpl)
                        mutation.addedNodes[i].replaceWith(tplElement)
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
        children: (config, elem) => {
            let that = this
            config.forEach(function(i){

                if(i.tag === "textNode") {
                    var content = i.html.split(" ")
                    content.forEach(item => {
                        let str = document.createTextNode(item)
                        if(str.nodeValue =="world") {
                            setTimeout(function() {
                                str.nodeValue = " milad"
                            }, 4000)
                        }
                        elem.appendChild(str)
                    })
                } else {
                    elem.appendChild(that.init(i))
                }
            })
        },
        callbacks: (config, elem) => {
            let that = this
            config.forEach(function(i){
                elem.addEventListener(i.event, i.callback)
            })
        },
        bind: (config, elem) => {
            function setVals(config) {
                config.binds.forEach((i) => {
                    if(i.property) {
                        elem[i.property] = config.i.data.value
                    }
                    if(i.attribute) {
                        elem.setAttribute(i.attribute, i.data.value)
                    }
                    if(i.callback) {
                        i.callback(i.data.value)
                    }
                })
            }
            setVals(config)
            config.data.onSet.push(function(e){
                setVals(config)
            })
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

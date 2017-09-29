import { elemConfig, elemRegisterConfig, elemTypeConfig } from './../interfaces/elem'
import { dataManager } from './dataManager'

export class elementManager {
    element
    types = {}
    registry = {}

    constructor() {
        this.watchElements(new dataManager())
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
        this.element = config.element = document.createElement(config.tag)
        !config.value ? false : this.element.value = config.value
        !config.html ? false : this.element.innerHTML = config.html
        !config.class ? false : this.element.className = config.class

        for(let i in config) {
            if(this.render[i]) this.render[i](config[i])
        }

        return this.element
    }
    watchElements = (dm) => {
        
        let that = this, JHCRdocObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation:any) {
                for(var i in mutation.addedNodes) {
                    if(that.registry[mutation.addedNodes[i].localName] && that.registry[mutation.addedNodes[i].localName].onSet) {
                        if(that.registry[mutation.addedNodes[i].localName].data) {
                            var db = dm.init();
                            db.set="data";
                            Object.defineProperty(mutation.addedNodes[i], "data", {
                                get() {
                                    return db.data;
                                },
                                set(e) {
                                    db.data = e;
                                }
                            });
                        }
                        mutation.addedNodes[i].find = mutation.addedNodes[i].querySelectorAll;
                        mutation.addedNodes[i].f = mutation.addedNodes[i].querySelectorAll;
                        that.registry[mutation.addedNodes[i].localName].onSet(mutation.addedNodes[i]);
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
        attributes: (config) => {
            for(let i in config) {
                this.element.setAttribute(i, config[i])
            }
        },
        properties: (config) => {
            for(let i in config) {
                this.element[i] = config[i]
            }
        },
        children: (config) => {
            config.forEach(function(i){
                this.element.appendChild(this.init(i))
            })
        },
        callbacks: (config) => {
            config.forEach(function(i){
                this.element.addEventListener(i.event, i.callback)
            })
        },
        bind: (config) => {
            function setVals(config) {
                config.binds.forEach((i) => {
                    if(i.property) {
                        this.element[i.property] = config.i.data.value
                    }
                    if(i.attribute) {
                        this.element.setAttribute(i.attribute, i.data.value)
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

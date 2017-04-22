new class JHCR_ELEMENT_CONTROLER {
    SELF:this
    register:Function
    addType:Function
    constructor(){
        var types = {}
        J.H = (config) => { 
            // HController START
            function init(config) {
                var literator
                if(typeof config === "string") {config={tag:config}}
                if(config.types) {
                    config.types.forEach(function(type){
                        for(literator in types[type]) {
                            config[literator] = types[type][literator]
                        }
                    })
                }
                config.tag = !config.tag ? 'div' : config.tag
                config.element = document.createElement(config.tag)
                !config.value ? false : config.element.value = config.value
                !config.html ? false : config.element.innerHTML = config.html
                !config.class ? false : config.element.className = config.class
                if(config.attributes) {
                    literator=""
                    for(literator in config.attributes) {
                        config.element.setAttribute(literator, config.attributes[literator])
                    }
                }
                if(config.properties) {
                    literator=""
                    for(literator in config.properties) {
                        config.element[literator] = config.properties[literator]
                    }
                }
                if(config.children) {
                    config.children.forEach(function(instance){
                        config.element.appendChild(init(instance))
                    })
                }
                if(config.callbacks) {
                    config.callbacks.forEach(function(instance){
                        config.element.addEventListener(instance.event, instance.callback)
                    })
                }
                if(config.bind) {
                    if(config.bind.property) {
                        config.element[config.bind.property] = config.bind.data.value
                    }
                    if(config.bind.attribute) {
                        config.element.setAttribute(config.bind.attribute, config.bind.data.value)
                    }
                    config.bind.data.onSet.push(function(e){
                        if(config.element) {
                            if(config.bind.property) {
                                config.element[config.bind.property] = e.value
                            }
                            if(config.bind.attribute) {
                                config.element.setAttribute(config.bind.attribute, config.bind.data.value)
                            }
                        }
                        if(config.bind.callback){
                            config.bind.callback(e)
                        }
                    })
                }
                return config.element
            }
            this.register = function(config) {
                var item;
                for(item in config) {
                    J.registry[item] = config[item];
                }
            }
            this.addType = function(typeConfig) {
                for( var t in typeConfig) {
                    types[t] = typeConfig[t]
                }
            }
            if(config){
                init(config)
            }
            return this
            // HController END
        }
    }
}
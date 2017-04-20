new class JHCR_ELEMENT_CONTROLER {
    newDataBase:any
    dataBase:any
    SELF:this
    register:Function
    constructor(){
        J.H = (config) => { 
            // HController START
            function init(config, db) {
                var literator
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
                        config.element.appendChild(init(instance, db))
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

                    // config.bind.element = config.element
                    // db.bind(config.bind)
                    // if(db.data[config.bind.data]) {db.data[config.bind.data] = db.data[config.bind.data] }
                }
                return config.element
            }
            
            this.register = function(config) {
                var item;
                for(item in config) {
                    J.registry[item] = config[item];
                }
            }
            if(config){
                init(config, this.dataBase)
            }
            return this
            // HController END
        }
    }
}
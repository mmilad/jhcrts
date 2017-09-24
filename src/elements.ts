
interface J_HTML_RENDER_CONFIG {
    [propName: string]: any;
    tag?: string;
    attributes?: any;
    properties?: any;
    children?: Array<J_HTML_RENDER_CONFIG>;
    callbacks?: Array<{ event: string, callback: Function }>;
    bind?: Array<{ properties: string, attribute:string, callback: Function }>;
    type?: string;
    types?: Array<string>;
    value?: string;
    html?: string;
    class?: string;
}
interface J_HTML_ADD_TYPE_CONFIG {
    [propName: string]: J_HTML_RENDER_CONFIG;
}
interface J_HTML_REGISTER_CONFIG {
    [propName: string]: any;
    onSet: Function;
    onRemove?: Function;
}
J.html = (config: J_HTML_RENDER_CONFIG) => {
    var element, has = {
        attributes: (config) => {
            for(let i in config) {
                element.setAttribute(i, config[i])
            }
        },
        properties: (config) => {
            for(let i in config) {
                element[i] = config[i]
            }
        },
        children: (config) => {
            config.forEach(function(i){
                element.appendChild(J.html(i))
            })
        },
        callbacks: (config) => {
            config.forEach(function(i){
                element.addEventListener(i.event, i.callback)
            })
        },
        bind: (config) => {
            function setVals(config) {
                config.binds.forEach((i) => {
                    if(i.property) {
                        element[i.property] = config.i.data.value
                    }
                    if(i.attribute) {
                        element.setAttribute(i.attribute, i.data.value)
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
    element = config.element = document.createElement(config.tag)
    !config.value ? false : element.value = config.value
    !config.html ? false : element.innerHTML = config.html
    !config.class ? false : element.className = config.class

    for(let i in config) {
        if(has[i]) has[i](config[i])
    }

    return element
}
J.html.__proto__ = {
    types: {},
    registry: {},
    register: (config: J_HTML_REGISTER_CONFIG)  => {
        for(let i in config) {
            J.registry[i] = config[i];
            J.html.registry[i] = config[i];
        }
    },
    addType: (config: J_HTML_ADD_TYPE_CONFIG) => {
        for( var t in config) {
            J.html.types[t] = config[t]
        }
    }
}
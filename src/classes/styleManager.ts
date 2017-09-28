export class styleManager {
    STYLE_ELEMENT:any 
    STYLE_LIST = {}
    sheet:any
    rules:any
    init = false    
    private fObj = {
        compileStyle: (config) => {
            debugger
            this.fObj.callAddToStyles(false, config)
            return config
        
        },
        callAddToStyles: (parentSelector, config) => {
            let that = this
            for(let i in config) {
                i.split(',').forEach(function(selector) {
                    let newSelector = parentSelector ? (parentSelector + " " +selector).replace(" &", "") : selector
                    that.fObj.addToStyles(newSelector, config[i])
                });
            }   
        },
        addToStyles: (selector, style) => {
            if(!this.STYLE_LIST[selector]) {
                this.fObj.addRule(selector)
            }
            for(let s in style) {
                if(s === "children") {
                    this.fObj.callAddToStyles(selector, style[s])
                } else {
                    this.STYLE_LIST[selector].style[s] = style[s];
                }
            }
            style.__proto__.style = this.STYLE_LIST[selector].style;
        },
        addRule: (rule) => {
            this.STYLE_LIST[rule] = this.rules[this.sheet.insertRule(rule + '{}', this.rules.length)]
        }
    }
    constructor (config) {
        if(!this.init) {
            this.STYLE_ELEMENT = document.createElement('style')
            this.STYLE_ELEMENT.type = "text/css"
            document.head.appendChild(this.STYLE_ELEMENT)
            this.sheet = document.styleSheets[document.styleSheets.length-1]
            this.rules = this.sheet.cssRules ? this.sheet.cssRules :  this.sheet.rules
        }
        this.fObj.compileStyle(config)
    }

}

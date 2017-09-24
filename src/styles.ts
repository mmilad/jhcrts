// new class JHCR_STYLE_CONTsOLLER {
//     update:object
//     sheet:any
//     rules:any
//     indexes:object
//     STYLE_LIST:any
//     STYLE_ELEMENT:any
//     initialized:boolean
//     addType:Function
//     getRule:Function
//     constructor(){
//         var types = {}
//         this.initialized = false
//         var SELF = this
//         J.C = (config) => {
//             var literator:any
//             if(!this.initialized) {
//                 this.STYLE_ELEMENT = document.createElement('style')
//                 this.STYLE_ELEMENT.type = "text/css"
//                 document.head.appendChild(this.STYLE_ELEMENT)
//                 this.sheet = document.styleSheets[document.styleSheets.length-1]
//                 this.rules = this.sheet.cssRules ? this.sheet.cssRules :  this.sheet.rules
//                 this.indexes = {}
//                 this.STYLE_LIST = {}
//                 this.initialized = true
//             }
//             function styleObjToStr2(config){
//                 var rule,
//                     currentRule,
//                     currentSelector = config.currentSelector,
//                     rules = config.rules

//                     currentRule = currentSelector + "{";
//                     for(rule in rules){
//                         if(rule !== "style") {
//                             if(typeof rules[rule] !== "object") {
//                                 currentRule += rule + ":" + rules[rule] + ";";
//                             } else {
//                                 var newSelector
//                                 if(rule.charAt(0) === "&") {
//                                     newSelector = config.currentSelector+rule.substr(1)
//                                 } else {
//                                     newSelector = config.currentSelector+ " " + rule
//                                 }
//                                 configStyle({
//                                     rules: config.rules[rule],
//                                     currentSelector: newSelector
//                                 })
//                             }
//                         }
//                     }
//                     currentRule += "}";
//                 return currentRule
//             }
//             function configStyle(config) {
//                 var rule, styleStr;
//                 if(config.currentSelector.charAt(0)==="@") {
//                     configSpecialStyle(config)
//                 } else {
//                     styleStr = styleObjToStr2(config)
//                     if(!SELF.STYLE_LIST[config.currentSelector]) {
//                         SELF.indexes[config.currentSelector] = SELF.sheet.insertRule(styleStr, SELF.rules.length)
//                         SELF.STYLE_LIST[config.currentSelector] = SELF.rules[SELF.indexes[config.currentSelector]];
//                         config.rules.style = SELF.STYLE_LIST[config.currentSelector].style
//                     } else {
//                         for(rule in config.rules) {
//                             if(rule !== "style") {
//                                 if(typeof config.rules[rule] !== "object") {
//                                     SELF.STYLE_LIST[config.currentSelector].style[rule] = config.rules[rule];
//                                 } else {
//                                     var newSelector
//                                     if(rule.charAt(0) === "&") {
//                                         newSelector = config.currentSelector+rule.substr(1)
//                                     } else {
//                                         newSelector = config.currentSelector+ " " + rule
//                                     }
//                                     configStyle({
//                                         rules: config.rules[rule],
//                                         currentSelector: newSelector
//                                     })
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             function configSpecialStyle(config) {
//                 if (config.currentSelector.substr(0, 10) === "@Keyframes") {
//                     addKeyframes (config)
//                 }
//             }
//             function addKeyframes (config){
//                 var styleStr = config.currentSelector+" {",
//                     step
//                 for(step in config.rules) {
//                     styleStr += styleObjToStr2({
//                         rules:config.rules[step],
//                         currentSelector: step
//                     })
//                 }
//                 styleStr += "}";
//                 SELF.STYLE_LIST[config.currentSelector] = SELF.rules[SELF.sheet.insertRule(styleStr, SELF.rules.length)];
//             }
//             this.getRule = function(selector) {
//                 return SELF.STYLE_LIST[selector].style
//             }
//             this.addType = function(typeConfig) {
//                 for( var t in typeConfig) {
//                     types[t] = typeConfig[t]
//                 }
//             }
//             if(config) {
//                 var styleName
//                 for(styleName in config) {
//                     configStyle({
//                         rules: config[styleName],
//                         currentSelector: styleName
//                     })
//                 }
//             }
//             return this
//         }
//     }
// }



J.css = (config) => {
    var that = J.css.__proto__
    if(!that.STYLE_ELEMENT) {
        that.STYLE_ELEMENT = document.createElement('style')
        that.STYLE_ELEMENT.type = "text/css"
        document.head.appendChild(that.STYLE_ELEMENT)
        that.sheet = document.styleSheets[document.styleSheets.length-1]
        that.rules = that.sheet.cssRules ? that.sheet.cssRules :  that.sheet.rules
        that.indexes = {}
        that.STYLE_LIST = {}
    }
    callAddToStyles(false, config)
    function callAddToStyles(parentSelector, config) {
        for(let i in config) {
            i.split(',').forEach(function(selector) {
                if(selector.charAt(0) === "@") {

                } else {
                    let newSelector = parentSelector ? (parentSelector + " " +selector).replace(" &", "") : selector
                    addToStyles(newSelector, config[i])
                }
            });
        }   
    }
    function addToStyles(selector, style) {
        if(!that.indexes[selector]) {
            that.indexes[selector] = that.sheet.insertRule(selector + " {}", that.rules.length)
            that.STYLE_LIST[selector] = that.rules[that.indexes[selector]];
        }
        for(let s in style) {
            if(s === "add") {
                callAddToStyles(selector, style[s])
            } else {
                that.STYLE_LIST[selector].style[s] = style[s];
            }
        }
        config.__proto__.style = that.STYLE_LIST[selector].style;
    }
    function addMediaQuery (query, selector, rule) {

    }
    return config

}
J.css.__proto__.getStyle = (style) => {
    return J.css.STYLE_LIST[style].style
}

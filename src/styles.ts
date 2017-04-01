new class JHCR_STYLE_CONTsOLLER {
    update:object
    s:object
    l:object
    sheet:any
    rules:any
    indexes:object
    STYLE_LIST:any
    STYLE_ELEMENT:any
    initialized:boolean
    constructor(){
        this.initialized = false
        var SELF = this
        J.C = (config) => {
            var literator:any
            if(!this.initialized) {
                this.STYLE_ELEMENT = document.createElement('style')
                this.STYLE_ELEMENT.type = "text/css"
                document.head.appendChild(this.STYLE_ELEMENT)
                this.sheet = document.styleSheets[document.styleSheets.length-1]
                this.rules = this.sheet.cssRules ? this.sheet.cssRules :  this.sheet.rules
                this.indexes = {}
                this.STYLE_LIST = {}
                this.initialized = true
            }
            this.update = (config) =>{
                var newConfig={},
                    selector,
                    rule,
                    currentRules;
                for (selector in config) {
                    // newConfig[selector] = {}
                    // if(this.STYLE_LIST[selector]) {
                    //     for(rule in this.STYLE_LIST[selector].rules){
                    //         newConfig[selector][rule] = this.STYLE_LIST[selector].rules[rule]
                    //     }
                    // }
                    // for(rule in config[selector]){
                    //     newConfig[selector][rule] = config[selector][rule]
                    // }
                    for(rule in config[selector]){
                        SELF.rules[SELF.indexes[selector]].style[rule] = config[selector][rule]
                    }
                }
                addStyle(newConfig)
            }
            function styleObjToStr(config){
                var selector, rule, currentRule;
                for (selector in config) {
                    currentRule = selector + "{";
                    for(rule in config[selector]){
                        currentRule += rule + ":" + config[selector][rule] + ";";
                    }
                    currentRule += "}";
                }
                return currentRule
            }
            function addStyle(config) {
                var index = 0, selector, rule, currentRule={}, currentRuleString;
                for (selector in config) {
                    currentRuleString = styleObjToStr({[selector]:config[selector]})
                    currentRule[selector] = config[selector]
                    if(!SELF.STYLE_LIST[selector]) {
                        SELF.STYLE_LIST[selector] = {}
                        SELF.STYLE_LIST[selector].rules = config[selector]
                        SELF.STYLE_LIST[selector].config = {}
                    } else {
                        index = SELF.STYLE_LIST[selector].config.index
                    }
                    if(!SELF.indexes[selector]) {
                        SELF.indexes[selector] = SELF.sheet.insertRule(currentRuleString, SELF.rules.length);
                    }
                }
            }
            if(config) {
                addStyle(config)
            }
            return this
        }
    }
}
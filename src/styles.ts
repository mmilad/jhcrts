new class JHCR_STYLE_CONTsOLLER {
    update:object
    s:object
    l:object
    sheet:any
    rules:any
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
                this.STYLE_LIST = {}
                this.initialized = true
            }
            this.update = (config) =>{
                var newConfig={},
                    selector,
                    rule,
                    currentRules;
                for (selector in config) {
                    newConfig[selector] = {}
                    if(this.STYLE_LIST[selector]) {
                        for(rule in this.STYLE_LIST[selector].rules){
                            newConfig[selector][rule] = this.STYLE_LIST[selector].rules[rule]
                        }
                    }
                    for(rule in config[selector]){
                        newConfig[selector][rule] = config[selector][rule]
                    }
                }
                addStyle(newConfig)
            }
            function styleObjToStr(config){
debugger;
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
                var index, selector, rule, currentRule={}, currentRuleString;
                    currentRuleString = styleObjToStr(config)
                for (selector in config) {
                    currentRule[selector] = config[selector]
                    if(!SELF.STYLE_LIST[selector]) {
                        SELF.STYLE_LIST[selector] = {}
                        SELF.STYLE_LIST[selector].rules = config[selector]
                        SELF.STYLE_LIST[selector].config = {}
                        index = SELF.sheet.rules.length
                    } else {
                        index = SELF.STYLE_LIST[selector].config.index
                    }
                    if(!SELF.rules[index]) {
                        SELF.STYLE_LIST[selector].config.index = SELF.sheet.insertRule(currentRuleString, index);
                    } else {
                        for(rule in config[selector]){
                            SELF.rules[index].style['border'] = "3px solid green"
                        }
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
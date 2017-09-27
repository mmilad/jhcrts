J.css = (config) => {
    var that = J.css.__proto__
    if(!that.STYLE_ELEMENT) {
        that.STYLE_ELEMENT = document.createElement('style')
        that.STYLE_ELEMENT.type = "text/css"
        document.head.appendChild(that.STYLE_ELEMENT)
        that.sheet = document.styleSheets[document.styleSheets.length-1]
        that.rules = that.sheet.cssRules ? that.sheet.cssRules :  that.sheet.rules
        that.STYLE_LIST = {}
    }
    callAddToStyles(false, config)
    function callAddToStyles(parentSelector, config) {
        for(let i in config) {
            i.split(',').forEach(function(selector) {
                let newSelector = parentSelector ? (parentSelector + " " +selector).replace(" &", "") : selector
                addToStyles(newSelector, config[i])
            });
        }   
    }
    function addToStyles(selector, style) {
        if(!that.STYLE_LIST[selector]) {
            J.css.addRule(selector)
        }
        for(let s in style) {
            if(s === "children") {
                callAddToStyles(selector, style[s])
            } else {
                that.STYLE_LIST[selector].style[s] = style[s];
            }
        }
        config.__proto__.style = that.STYLE_LIST[selector].style;
    }
    return config

}
J.css.__proto__ = {
    getStyle: (style):any => {
        if(!J.css.STYLE_LIST[style]) J.css.addRule(style)
        return J.css.STYLE_LIST[style].style
    },
    getStyleSheets: ():any => {
        return document.styleSheets
    },
    getCurrentStyle: (style) => {
        let a, b, searchingStyles = true, searchingIndex = 0, currentStyleSheet, styleSheets = J.css.getStyleSheets(), currentStyle = J.css.getStyle(style)
        for( a in styleSheets) {
            currentStyleSheet = styleSheets[a].cssRules ? styleSheets[a].cssRules : styleSheets[a].rules
            for(b in currentStyleSheet) {
                if(currentStyleSheet[b].selectorText === style) {
                    while(searchingStyles) {
                        if(currentStyleSheet[b].style[searchingIndex]) {
                            currentStyle[currentStyleSheet[b].style[searchingIndex]] = currentStyleSheet[b].style[currentStyleSheet[b].style[searchingIndex]]
                            searchingIndex++
                        } else {
                            searchingStyles = false;
                            searchingIndex = 0;
                        }
                    }
                    searchingStyles = true
                }
                currentStyleSheet[b]
            }
        }
        return currentStyle
    },
    addRule: (rule) => {
        J.css.STYLE_LIST[rule] = J.css.rules[J.css.sheet.insertRule(rule + '{}', J.css.rules.length)]
    }
}
export class styleManager {
    STYLE_ELEMENT: any
    STYLE_LIST: any
    sheet: any;
    rules: any;

    constructor() {
        this.STYLE_ELEMENT = document.createElement('style')
        this.STYLE_ELEMENT.type = "text/css"
        document.head.appendChild(this.STYLE_ELEMENT)
        this.sheet = document.styleSheets[document.styleSheets.length - 1]
        this.rules = this.sheet.cssRules ? this.sheet.cssRules : this.sheet.rules
        this.STYLE_LIST = {}

        for (let i in this.protos) {
            this.init[i] = this.protos[i]
        }
    }

    init: any = (config?: any) => {
        return this.callAddToStyles(false, config)
    }

    callAddToStyles = (parentSelector, config) => {
        let that = this
        for (let i in config) {
            i.split(',').forEach(function (selector) {
                let newSelector = parentSelector ? (parentSelector + " " + selector).replace(" &", "") : selector
                that.addToStyles(newSelector, config[i])
            });
        }
        return config
    }

    addToStyles(selector, style) {
        if (!this.STYLE_LIST[selector]) {
            this.addRule(selector)
        }
        for (let s in style) {
            if (s === "children") {
                this.callAddToStyles(selector, style[s])
            } else {
                this.STYLE_LIST[selector].style[s] = style[s];
            }
        }
        style.style = this.STYLE_LIST[selector].style;
    }
    addRule = (rule) => {
        this.STYLE_LIST[rule] = this.rules[this.sheet.insertRule(rule + '{}', this.rules.length)]
    }

    getStyle = (style) => {
        if (!this.STYLE_LIST[style]) this.addRule(style)
        return this.STYLE_LIST[style].style
    }

    getStyleSheets() {
        return document.styleSheets
    }

    getCurrentStyle = (style) => {
        let a, b, searchingStyles = true, searchingIndex = 0, currentStyleSheet, styleSheets = this.getStyleSheets(), currentStyle = this.getStyle(style)
        for (a in styleSheets) {
            currentStyleSheet = styleSheets[a]["cssRules"] ? styleSheets[a]["cssRules"] : styleSheets[a]["rules"]
            for (b in currentStyleSheet) {
                if (currentStyleSheet[b].selectorText === style) {
                    while (searchingStyles) {
                        if (currentStyleSheet[b].style[searchingIndex]) {
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
    }

    protos = {
        getCurrentStyle: this.getCurrentStyle,
        getStyle: this.getStyle
    }
}

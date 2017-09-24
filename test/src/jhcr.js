var J = {
    HELPER: {},
    registry: {}
};
J.helper = J.HELPER;
var JHCRdocObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        for (var i in mutation.addedNodes) {
            if (J.registry[mutation.addedNodes[i].localName] && J.registry[mutation.addedNodes[i].localName].onSet) {
                var db = J.HELPER.magic();
                db.set = "data";
                Object.defineProperty(mutation.addedNodes[i], "data", {
                    get: function () {
                        return db.data;
                    },
                    set: function (e) {
                        db.data = e;
                    }
                });
                mutation.addedNodes[i].find = mutation.addedNodes[i].querySelectorAll;
                mutation.addedNodes[i].f = mutation.addedNodes[i].querySelectorAll;
                J.registry[mutation.addedNodes[i].localName].onSet(mutation.addedNodes[i]);
            }
        }
        for (var i in mutation.removedNodes) {
            if (J.registry[mutation.removedNodes[i].localName] && J.registry[mutation.removedNodes[i].localName].onRemove) {
                J.registry[mutation.removedNodes[i].localName].onRemove(mutation.removedNodes[i]);
            }
        }
    });
});
JHCRdocObserver.observe(document, { childList: true, subtree: true });
J.html = function (config) {
    var element, has = {
        attributes: function (config) {
            for (var i in config) {
                element.setAttribute(i, config[i]);
            }
        },
        properties: function (config) {
            for (var i in config) {
                element[i] = config[i];
            }
        },
        children: function (config) {
            config.forEach(function (i) {
                element.appendChild(this(i));
            });
        },
        callbacks: function (config) {
            config.forEach(function (i) {
                element.addEventListener(i.event, i.callback);
            });
        },
        bind: function (config) {
            function setVals(config) {
                config.binds.forEach(function (i) {
                    if (i.property) {
                        element[i.property] = config.i.data.value;
                    }
                    if (i.attribute) {
                        element.setAttribute(i.attribute, i.data.value);
                    }
                    if (i.callback) {
                        i.callback(i.data.value);
                    }
                });
            }
            setVals(config);
            config.data.onSet.push(function (e) {
                setVals(config);
            });
        }
    };
    if (typeof config === "string") {
        config = { tag: config };
    }
    if (config.types) {
        config.types.forEach(function (t) {
            for (var i in this.types[t]) {
                config[i] = this.types[t][i];
            }
        });
    }
    if (config.type) {
        for (var i in config.types[config.type]) {
            if (!config[i])
                config[i] = config.types[config.type][i];
        }
    }
    config.tag = !config.tag ? 'div' : config.tag;
    element = config.element = document.createElement(config.tag);
    !config.value ? false : element.value = config.value;
    !config.html ? false : element.innerHTML = config.html;
    !config.class ? false : element.className = config.class;
    for (var i in config) {
        if (has[i])
            has[i](config[i]);
    }
    return element;
};
J.html.__proto__ = {
    types: {},
    registry: {},
    register: function (config) {
        for (var i in config) {
            J.registry[i] = config[i];
            J.html.registry[i] = config[i];
        }
    },
    addType: function (config) {
        for (var t in config) {
            J.html.types[t] = config[t];
        }
    }
};
var _this = this;
var JHCR_REQUEST_CONTROLLER = (function () {
    function JHCR_REQUEST_CONTROLLER() {
    }
    return JHCR_REQUEST_CONTROLLER;
}());
J.request = function (config) {
    var SELF = _this;
    var baseConfig = { type: "POST", async: true, data: null };
    for (var i in config) {
        baseConfig[i] = config[i];
    }
    httpGetAsync(config);
    function httpGetAsync(config) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(config.type, config.url, config.async);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                config.callback(xmlHttp.responseText);
            }
        };
        xmlHttp.send(config.data);
    }
    return _this;
};
J.request.__proto__ = {
    loadJs: function (config) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function (e) {
            window["config"];
            config.callback(e);
        };
        script.src = config.url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    build: function (config) {
        var _this = this;
        var that = this;
        config.run = function () {
            _this(config);
        };
        return config;
    }
};
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
J.css = function (config) {
    var that = J.css.__proto__;
    if (!that.STYLE_ELEMENT) {
        that.STYLE_ELEMENT = document.createElement('style');
        that.STYLE_ELEMENT.type = "text/css";
        document.head.appendChild(that.STYLE_ELEMENT);
        that.sheet = document.styleSheets[document.styleSheets.length - 1];
        that.rules = that.sheet.cssRules ? that.sheet.cssRules : that.sheet.rules;
        that.indexes = {};
        that.STYLE_LIST = {};
    }
    for (var i in config) {
        addToStyles(i, config[i]);
    }
    function addToStyles(selector, style) {
        var currentStyle;
        if (!that.indexes[selector]) {
            that.indexes[selector] = that.sheet.insertRule(selector + " {}", that.rules.length);
            that.STYLE_LIST[selector] = that.rules[that.indexes[selector]];
        }
        config.__proto__.style = currentStyle = that.STYLE_LIST[selector].style;
        for (var s in style) {
            if (s === "add") {
                for (var newSelector in style[s]) {
                    addToStyles((selector + newSelector).replace(" &", ""), style[s]);
                }
            }
            currentStyle[s] = style[s];
        }
    }
    return config;
};
J.css.__proto__.getStyle = function (style) {
    return J.css.STYLE_LIST[style].style;
};
J.HELPER.DATA = {};
new (function () {
    function JHCR_HELPER_DATABASE_CONTROLLER() {
        J.HELPER.magic = function () {
            var killed = false;
            function JHCR_MagicObject() {
                var db = Object.create({}), sets = [];
                db.__proto__.onSet = [];
                Object.defineProperty(db.__proto__, "set", {
                    get: function () {
                        return sets;
                    },
                    set: function (e) {
                        sets.push(e);
                        configProp(db, e);
                    }
                });
                return db;
            }
            function configProp(obj, prop) {
                var i, db = JHCR_MagicObject();
                if (!obj.__proto__[prop]) {
                    Object.defineProperty(obj.__proto__, prop, {
                        get: function () {
                            return db;
                        },
                        set: function (e) {
                            if (!killed) {
                                killed = true;
                                for (i in db.set) {
                                    killData(db, db.set[i]);
                                }
                                killed = false;
                            }
                            db.onSet.forEach(function (cb) {
                                cb({
                                    oldValue: db.__proto__.value,
                                    value: e
                                });
                            });
                            db.__proto__.value = e;
                            if (typeof e === "object") {
                                for (i in e) {
                                    if (!db[i]) {
                                        db.set = i;
                                    }
                                    db[i] = e[i];
                                }
                            }
                        }
                    });
                }
            }
            function killData(obj, data) {
                var i;
                obj[data] = "";
                for (i in obj[data].set) {
                    killData(obj[data], obj[data].set[i]);
                }
            }
            return JHCR_MagicObject();
        };
    }
    return JHCR_HELPER_DATABASE_CONTROLLER;
}());

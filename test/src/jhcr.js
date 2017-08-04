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
new (function () {
    function JHCR_ELEMENT_CONTROLER() {
        var _this = this;
        var types = {};
        J.H = function (config) {
            // HController START
            function init(config) {
                var literator;
                if (typeof config === "string") {
                    config = { tag: config };
                }
                if (config.types) {
                    config.types.forEach(function (type) {
                        for (literator in types[type]) {
                            config[literator] = types[type][literator];
                        }
                    });
                }
                config.tag = !config.tag ? 'div' : config.tag;
                config.element = document.createElement(config.tag);
                !config.value ? false : config.element.value = config.value;
                !config.html ? false : config.element.innerHTML = config.html;
                !config.class ? false : config.element.className = config.class;
                if (config.attributes) {
                    literator = "";
                    for (literator in config.attributes) {
                        config.element.setAttribute(literator, config.attributes[literator]);
                    }
                }
                if (config.properties) {
                    literator = "";
                    for (literator in config.properties) {
                        config.element[literator] = config.properties[literator];
                    }
                }
                if (config.children) {
                    config.children.forEach(function (instance) {
                        config.element.appendChild(init(instance));
                    });
                }
                if (config.callbacks) {
                    config.callbacks.forEach(function (instance) {
                        config.element.addEventListener(instance.event, instance.callback);
                    });
                }
                if (config.bind) {
                    if (config.bind.property) {
                        config.element[config.bind.property] = config.bind.data.value;
                    }
                    if (config.bind.attribute) {
                        config.element.setAttribute(config.bind.attribute, config.bind.data.value);
                    }
                    config.bind.data.onSet.push(function (e) {
                        if (config.element) {
                            if (config.bind.property) {
                                config.element[config.bind.property] = e.value;
                            }
                            if (config.bind.attribute) {
                                config.element.setAttribute(config.bind.attribute, config.bind.data.value);
                            }
                        }
                        if (config.bind.callback) {
                            config.bind.callback(e);
                        }
                    });
                }
                return config.element;
            }
            _this.register = function (config) {
                var item;
                for (item in config) {
                    J.registry[item] = config[item];
                }
            };
            _this.addType = function (typeConfig) {
                for (var t in typeConfig) {
                    types[t] = typeConfig[t];
                }
            };
            if (config) {
                init(config);
            }
            return _this;
            // HController END
        };
    }
    return JHCR_ELEMENT_CONTROLER;
}());
new (function () {
    function JHCR_REQUEST_CONTROLLER() {
        var _this = this;
        J.R = function (config) {
            var SELF = _this, lit;
            _this.get = function (config) {
                var baseConfig = { type: "GET", async: true, data: null };
                for (lit in config) {
                    baseConfig[lit] = config[lit];
                }
                httpGetAsync(baseConfig);
            };
            _this.post = function (config) {
                var baseConfig = { type: "POST", async: true, data: null };
                for (lit in config) {
                    baseConfig[lit] = config[lit];
                }
                httpGetAsync(baseConfig);
            };
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
            _this.request = function (config) {
                SELF.post(config);
            };
            _this.loadJsFile = function (config) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.onload = function (e) {
                    window["config"];
                    config.callback(e);
                };
                script.src = config.url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };
            if (config) {
                _this.request(config);
            }
            return _this;
        };
    }
    return JHCR_REQUEST_CONTROLLER;
}());
new (function () {
    function JHCR_STYLE_CONTsOLLER() {
        var _this = this;
        var types = {};
        this.initialized = false;
        var SELF = this;
        J.C = function (config) {
            var literator;
            if (!_this.initialized) {
                _this.STYLE_ELEMENT = document.createElement('style');
                _this.STYLE_ELEMENT.type = "text/css";
                document.head.appendChild(_this.STYLE_ELEMENT);
                _this.sheet = document.styleSheets[document.styleSheets.length - 1];
                _this.rules = _this.sheet.cssRules ? _this.sheet.cssRules : _this.sheet.rules;
                _this.indexes = {};
                _this.STYLE_LIST = {};
                _this.initialized = true;
            }
            _this.update = function (config) {
                var newConfig = {}, selector, rule, currentRules;
                for (selector in config) {
                    for (rule in config[selector]) {
                        SELF.rules[SELF.indexes[selector]].style[rule] = config[selector][rule];
                    }
                }
                addStyle(newConfig);
            };
            function styleObjToStr(config, currentSelector) {
                var selector, rule, currentRule;
                for (selector in config) {
                    currentSelector = currentSelector
                        ? currentSelector + " " + selector
                        : selector;
                    currentRule = currentSelector + "{";
                    for (rule in config[selector]) {
                        if (rule !== "children" && rule !== "callback" && rule !== "types") {
                            currentRule += rule + ":" + config[currentSelector][rule] + ";";
                        }
                    }
                    currentRule += "}";
                }
                return currentRule;
            }
            function addStyle(config) {
                var index = 0, selector, rule, currentRule = {}, currentRuleString;
                for (selector in config) {
                    if (config[selector].types) {
                        config[selector].types.forEach(function (type) {
                            for (literator in types[type]) {
                                config[selector][literator] = types[type][literator];
                            }
                        });
                    }
                    currentRuleString = styleObjToStr((_a = {}, _a[selector] = config[selector], _a), false);
                    if (config[selector].children) {
                        addStyle(config[selector].children);
                    }
                    currentRule[selector] = config[selector];
                    if (!SELF.STYLE_LIST[selector]) {
                        SELF.STYLE_LIST[selector] = {};
                        SELF.STYLE_LIST[selector].rules = config[selector];
                        SELF.STYLE_LIST[selector].config = {};
                    }
                    else {
                        index = SELF.STYLE_LIST[selector].config.index;
                    }
                    if (!SELF.indexes[selector]) {
                        SELF.indexes[selector] = SELF.sheet.insertRule(currentRuleString, SELF.rules.length);
                        if (config[selector].callback) {
                            config[selector].callback(SELF.rules[SELF.indexes[selector]]);
                        }
                    }
                }
                var _a;
            }
            _this.addType = function (typeConfig) {
                for (var t in typeConfig) {
                    types[t] = typeConfig[t];
                }
            };
            if (config) {
                addStyle(config);
            }
            return _this;
        };
    }
    return JHCR_STYLE_CONTsOLLER;
}());
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

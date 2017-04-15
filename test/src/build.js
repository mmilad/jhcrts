var J = {
    HELPER: {},
    path: document.currentScript.src
};
new (function () {
    function JHCR_ELEMENT_CONTROLER() {
        var _this = this;
        J.H = function (config) {
            // HController START
            if (!_this.dataBase) {
                _this.dataBase = new J.HELPER.DATA.newDataBase();
            }
            function init(config, db) {
                var literator;
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
                        config.element.appendChild(init(instance, db));
                    });
                }
                if (config.callbacks) {
                    config.callbacks.forEach(function (instance) {
                        config.element.addEventListener(instance.event, instance.callback);
                    });
                }
                if (config.bind) {
                    config.bind.element = config.element;
                    db.bind(config.bind);
                    if (db.data[config.bind.data]) {
                        db.data[config.bind.data] = db.data[config.bind.data];
                    }
                }
                return config.element;
            }
            _this.register = function (config) {
                window[config.register] = function () {
                    return Reflect.construct(HTMLElement, [], window[config.register]);
                };
                window[config.register].prototype.attributeChangedCallback = function (name, oldValue, newValue) {
                    console.log(oldValue);
                    console.log(newValue);
                };
                window[config.register].prototype.connectedCallback = function () {
                    J.H(config);
                    this.innerHTML = "";
                    this.appendChild(config.element);
                };
                window[config.register].observedAttributes = ['class'];
                window[config.register].prototype.__proto__ = HTMLElement.prototype;
                window[config.register].__proto__ = HTMLElement;
                customElements.define(config.register, window[config.register]);
            };
            if (config) {
                init(config, _this.dataBase);
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
                var baseConfig = {
                    url: "",
                    prepend: {
                        js: [],
                        css: []
                    },
                    append: {
                        js: [],
                        css: []
                    },
                    callback: function () {
                    },
                    appendJhcr: true
                }, frame;
                SELF.loadJsFile(config.url + "html.js", function (e) {
                    this;
                    console.log("loadseds");
                });
            };
            _this.loadJsFile = function (url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.onload = function (e) {
                    window["config"];
                    callback(e);
                };
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };
            // if(config) {this.request(config)}
            return _this;
        };
    }
    return JHCR_REQUEST_CONTROLLER;
}());
new (function () {
    function JHCR_STYLE_CONTsOLLER() {
        var _this = this;
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
                    // newConfig[selector] = {}
                    // if(this.STYLE_LIST[selector]) {
                    //     for(rule in this.STYLE_LIST[selector].rules){
                    //         newConfig[selector][rule] = this.STYLE_LIST[selector].rules[rule]
                    //     }
                    // }
                    // for(rule in config[selector]){
                    //     newConfig[selector][rule] = config[selector][rule]
                    // }
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
                        if (rule !== "children" && rule !== "types") {
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
                    }
                }
                var _a;
            }
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
        // if(!inited) {
        //     var inited = true
        //         window['new-db-object'] = function() {
        //             return Reflect.construct(HTMLElement, [], window['new-db-object']);
        //         }
        //         window['new-db-object'].prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        //             console.log(oldValue);
        //             console.log(newValue);
        //         }
        //         window['new-db-object'].prototype.connectedCallback = function () {
        //             // J.H(config)
        //             // this.innerHTML ="";
        //             // this.appendChild(config.element)
        //         }
        //         window['new-db-object'].observedAttributes = ['data-*'];
        //         window['new-db-object'].prototype.__proto__ = HTMLElement.prototype;
        //         window['new-db-object'].__proto__ = HTMLElement;
        //         customElements.define('new-db-object', window['new-db-object']);
        // }
        J.HELPER.DATA.newDataBase = function () {
            return new function () {
                var ATTACHMENTS = [], BACKUP = {}, BACKUP_VERSIONS = {}, DATABASE = document.createElement('select'), obj = {};
                obj.data = DATABASE.dataset;
                obj.bind = function (config) {
                    if (!ATTACHMENTS[config.data]) {
                        ATTACHMENTS[config.data] = [];
                    }
                    ATTACHMENTS[config.data].push(config);
                };
                function conCamel(input) {
                    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
                        return group1.toUpperCase();
                    });
                }
                function makeBackUp(dataName) {
                    if (!BACKUP[dataName]) {
                        BACKUP[dataName] = [];
                    }
                    BACKUP[dataName].push(obj.data[dataName]);
                    BACKUP_VERSIONS[dataName]++;
                }
                function checkItem(dataName) {
                    !BACKUP[dataName] ? BACKUP[dataName] = [] : false;
                    !BACKUP_VERSIONS[dataName] ? BACKUP_VERSIONS[dataName] = 0 : false;
                }
                function init(db) {
                    var docObserver = new MutationObserver(function (mutations) {
                        var key, itemFound;
                        mutations.forEach(function (mutation) {
                            key = conCamel(mutation.attributeName.substring(5));
                            checkItem(key);
                            if (ATTACHMENTS[key]) {
                                ATTACHMENTS[key].forEach(function (config) {
                                    if (config.element) {
                                        if (config.attribute) {
                                            if (config.attribute === "plain") {
                                                if (BACKUP_VERSIONS[key] !== 0) {
                                                    var lastVersion = BACKUP[key][BACKUP_VERSIONS[key] - 1], lastValue = config.element.getAttribute(lastVersion);
                                                    if (lastValue) {
                                                        lastValue = '';
                                                    }
                                                    config.element.removeAttribute(lastVersion);
                                                    config.element.setAttribute(db[key], lastValue);
                                                }
                                                else {
                                                    config.element.setAttribute(db[key], '');
                                                }
                                            }
                                        }
                                        if (config.property) {
                                            config.element[config.property] = db[key];
                                        }
                                    }
                                    if (config.find) {
                                        itemFound = document.querySelectorAll(config.find);
                                        itemFound.forEach(function (itemInstance) {
                                            if (config.attribute) {
                                                itemInstance.setAttribute(config.attribute, db[key]);
                                            }
                                            if (config.property) {
                                                itemInstance[config.property] = db[key];
                                            }
                                        });
                                    }
                                    !config.callback ? false : config.callback(db[key]);
                                    makeBackUp(key);
                                });
                            }
                        });
                    });
                    docObserver.observe(DATABASE, { attributes: true });
                }
                init(DATABASE.dataset);
                return obj;
            };
        };
        J.HELPER.DATA.db = function () {
        };
    }
    return JHCR_HELPER_DATABASE_CONTROLLER;
}());

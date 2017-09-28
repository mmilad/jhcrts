/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var styleManager_1 = __webpack_require__(1);
var fwName = "jhcr";
var x = new styleManager_1.styleManager();
// define caller functions
window[fwName] = {
    css: x.init
};
// define proto functions
for (var i in x.protos) {
    window[fwName].css.__proto__[i] = x.protos[i];
}
// new styleManager()
// styleManager.length
// for(let i in styleManager.protoFunction)
// window[fwName].css.__proto__

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var styleManager = /** @class */(function () {
    function styleManager() {
        var _this = this;
        this.protos = {};
        this.compileStyle = function (config) {
            return _this.getCurrentStyle(config);
        };
        this.callAddToStyles = function (parentSelector, config) {
            var that = _this;
            var _loop_1 = function _loop_1(i) {
                i.split(',').forEach(function (selector) {
                    var newSelector = parentSelector ? (parentSelector + " " + selector).replace(" &", "") : selector;
                    that.addToStyles(newSelector, config[i]);
                });
            };
            for (var i in config) {
                _loop_1(i);
            }
        };
        this.init = function (config) {
            _this.callAddToStyles(false, config);
        };
        this.addRule = function (rule) {
            _this.STYLE_LIST[rule] = _this.rules[_this.sheet.insertRule(rule + '{}', _this.rules.length)];
        };
        this.getStyle = function (style) {
            if (!_this.STYLE_LIST[style]) _this.addRule(style);
            return _this.STYLE_LIST[style].style;
        };
        this.STYLE_ELEMENT = document.createElement('style');
        this.STYLE_ELEMENT.type = "text/css";
        document.head.appendChild(this.STYLE_ELEMENT);
        this.sheet = document.styleSheets[document.styleSheets.length - 1];
        this.rules = this.sheet.cssRules ? this.sheet.cssRules : this.sheet.rules;
        this.STYLE_LIST = {};
        this.protos = {
            compileStyle: this.compileStyle,
            getStyle: this.getStyle
        };
    }
    styleManager.prototype.addToStyles = function (selector, style) {
        if (!this.STYLE_LIST[selector]) {
            this.addRule(selector);
        }
        for (var s in style) {
            if (s === "children") {
                this.callAddToStyles(selector, style[s]);
            } else {
                this.STYLE_LIST[selector].style[s] = style[s];
            }
        }
        style.__proto__.style = this.STYLE_LIST[selector].style;
    };
    styleManager.prototype.getStyleSheets = function () {
        return document.styleSheets;
    };
    styleManager.prototype.getCurrentStyle = function (style) {
        var a,
            b,
            searchingStyles = true,
            searchingIndex = 0,
            currentStyleSheet,
            styleSheets = this.getStyleSheets(),
            currentStyle = this.getStyle(style);
        for (a in styleSheets) {
            currentStyleSheet = styleSheets[a]["cssRules"] ? styleSheets[a]["cssRules"] : styleSheets[a]["rules"];
            for (b in currentStyleSheet) {
                if (currentStyleSheet[b].selectorText === style) {
                    while (searchingStyles) {
                        if (currentStyleSheet[b].style[searchingIndex]) {
                            currentStyle[currentStyleSheet[b].style[searchingIndex]] = currentStyleSheet[b].style[currentStyleSheet[b].style[searchingIndex]];
                            searchingIndex++;
                        } else {
                            searchingStyles = false;
                            searchingIndex = 0;
                        }
                    }
                    searchingStyles = true;
                }
                currentStyleSheet[b];
            }
        }
        return currentStyle;
    };
    return styleManager;
})();
exports.styleManager = styleManager;

/***/ })
/******/ ]);
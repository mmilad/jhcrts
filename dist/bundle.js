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
window["jhcr"] = {
    css: styleManager_1.styleManager
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var styleManager = /** @class */(function () {
    function styleManager(config) {
        var _this = this;
        this.STYLE_LIST = {};
        this.init = false;
        this.fObj = {
            compileStyle: function compileStyle(config) {
                debugger;
                _this.fObj.callAddToStyles(false, config);
                return config;
            },
            callAddToStyles: function callAddToStyles(parentSelector, config) {
                var that = _this;
                var _loop_1 = function _loop_1(i) {
                    i.split(',').forEach(function (selector) {
                        var newSelector = parentSelector ? (parentSelector + " " + selector).replace(" &", "") : selector;
                        that.fObj.addToStyles(newSelector, config[i]);
                    });
                };
                for (var i in config) {
                    _loop_1(i);
                }
            },
            addToStyles: function addToStyles(selector, style) {
                if (!_this.STYLE_LIST[selector]) {
                    _this.fObj.addRule(selector);
                }
                for (var s in style) {
                    if (s === "children") {
                        _this.fObj.callAddToStyles(selector, style[s]);
                    } else {
                        _this.STYLE_LIST[selector].style[s] = style[s];
                    }
                }
                style.__proto__.style = _this.STYLE_LIST[selector].style;
            },
            addRule: function addRule(rule) {
                _this.STYLE_LIST[rule] = _this.rules[_this.sheet.insertRule(rule + '{}', _this.rules.length)];
            }
        };
        if (!this.init) {
            this.STYLE_ELEMENT = document.createElement('style');
            this.STYLE_ELEMENT.type = "text/css";
            document.head.appendChild(this.STYLE_ELEMENT);
            this.sheet = document.styleSheets[document.styleSheets.length - 1];
            this.rules = this.sheet.cssRules ? this.sheet.cssRules : this.sheet.rules;
        }
        this.fObj.compileStyle(config);
    }
    return styleManager;
})();
exports.styleManager = styleManager;
// J.css.__proto__ = {
//     getStyle: (style):any => {
//         if(!J.css.STYLE_LIST[style]) J.css.addRule(style)
//         return J.css.STYLE_LIST[style].style
//     },
//     getStyleSheets: ():any => {
//         return document.styleSheets
//     },
//     getCurrentStyle: (style) => {
//         let a, b, searchingStyles = true, searchingIndex = 0, currentStyleSheet, styleSheets = J.css.getStyleSheets(), currentStyle = J.css.getStyle(style)
//         for( a in styleSheets) {
//             currentStyleSheet = styleSheets[a].cssRules ? styleSheets[a].cssRules : styleSheets[a].rules
//             for(b in currentStyleSheet) {
//                 if(currentStyleSheet[b].selectorText === style) {
//                     while(searchingStyles) {
//                         if(currentStyleSheet[b].style[searchingIndex]) {
//                             currentStyle[currentStyleSheet[b].style[searchingIndex]] = currentStyleSheet[b].style[currentStyleSheet[b].style[searchingIndex]]
//                             searchingIndex++
//                         } else {
//                             searchingStyles = false;
//                             searchingIndex = 0;
//                         }
//                     }
//                     searchingStyles = true
//                 }
//                 currentStyleSheet[b]
//             }
//         }
//         return currentStyle
//     },
//     addRule: (rule) => {
//         J.css.STYLE_LIST[rule] = J.css.rules[J.css.sheet.insertRule(rule + '{}', J.css.rules.length)]
//     }
// }

/***/ })
/******/ ]);
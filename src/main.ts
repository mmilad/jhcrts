import {styleManager} from "./classes/styleManager"

var fwName = "jhcr"
var x = new styleManager()


// define caller functions
window[fwName] = {
    css: x.callAddToStylesInit
}

// define proto functions
for(let i in x.protos) {
    window[fwName].css.__proto__[i] = x.protos[i]
}

// new styleManager()
// styleManager.length
// for(let i in styleManager.protoFunction)
// window[fwName].css.__proto__
import { styleManager } from "./classes/styleManager"
import { elementManager } from "./classes/elementManager"
import { dataManager } from "./classes/dataManager"






var fwName = "jhcr"

// define caller functions
window[fwName] = {
    css: new styleManager().init,
    html: new elementManager().init,
    data: new dataManager().init
}

// define proto functions
// for(let i in x.protos) {
//     window[fwName].css.__proto__[i] = x.protos[i]
// }
// for(let i in y.protos) {
//     debugger
//     window[fwName].html.__proto__[i] = y.protos[i]
// }

// new styleManager()
// styleManager.length
// for(let i in styleManager.protoFunction)
// window[fwName].css.__proto__
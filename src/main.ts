import { Polifiller } from "./polyfill/polyfill"
import { styleManager } from "./classes/styleManager"
import { elementManager } from "./classes/elementManager"
import { dataManager } from "./classes/dataManager"
import { MergeDeep } from './classes/helper/deepMerger'



new Polifiller()

var fwName = "jhcr",
    helper = {
        merge: new MergeDeep().deepMerge
    },
    em = new elementManager(helper)
// define caller functions
window[fwName] = {
    css: new styleManager().init,
    html: em.init,
    data: new dataManager().init
}
em.watchElements()
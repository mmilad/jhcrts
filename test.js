var himalaya = require('himalaya')
var html = require('fs').readFileSync('./test.html', { encoding: 'utf8' })

function compileHtml(html) {
    html = html.replace(/\n/g, '');
    html = html.replace(/\r/g, '');
    html = html.replace(/\t/g, '');
    html = html.replace(/  /g, '');
    var json = himalaya.parse(html)
// console.log(json)
 console.dir(json, { depth: null })
    json.forEach(readNode)
}

compileHtml(html)
function readNode(node) {
    if (node.tagName) console.log(node.tagName)
    if(node.children) node.children.forEach(readNode);
}
// console.log(html)
// console.dir(json, { depth: null })

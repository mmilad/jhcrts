var himalaya = require('himalaya'),
    fs = require('fs')
var html = fs.readFileSync('./test.html', { encoding: 'utf8' })

var component = {}

function compileHtml(html) {
    html = html.replace(/\n/g, '');
    html = html.replace(/\r/g, '');
    html = html.replace(/\t/g, '');
    html = html.replace(/  /g, '');
    
    var json = himalaya.parse(html)
 
    if(json[0].tagName === "component") {
        if(json[0].attributes) {
            if(!component[json[0].attributes.name]) {
                component[json[0].attributes.name] = {}
            }
            component[json[0].attributes.name].tpl = []
            if(json[0].children) {
                json[0].children.forEach(e => {
                    formatToConfig(e, component[json[0].attributes.name].tpl)
                })
            }
            console.log( component, { depth: null })

            saveConfig(component)
        }
    }
}

compileHtml(html)
function formatToConfig(node, parent) {
    var config = {
        attributes: {},
        children: []
    }
    if (node.tagName) {
        config.tag = node.tagName;
    }
    if(node.children) {
        node.children.forEach(e => {
            formatToConfig(e, config.children)
        });
    }
    parent.push(config)
}
// console.log(html)
// console.dir(json, { depth: null })

function saveConfig (str) {
    fs.writeFile("/renderedConfig.js", str, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
}
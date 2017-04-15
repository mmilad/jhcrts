function main() {
    
    var H = J.H,
        DB = H().data,
        mainContainer;
    var button;
    mainContainer = {
        children:[
            {
                attributes: {
                    class: "bar"
                },
                tag: "input",
                callbacks: [{
                    event: "keyup",
                    callback: function(){
                        DB.foo = this.value;
                    }
                }]
            },{
                tag: "a",
                attributes: {
                    class: "foo"
                },
                bind:{
                    data: "foo",
                    property: "innerHTML",
                    attribute: "plain"
                }
            },{
                html: "adasd",
                attributes: {
                    class: "fooo"
                }
            },
            {
                attributes:{
                    class: "holder"
                },
                children:[
                    {attributes:{class:"hold1"}},
                    {attributes:{class:"hold2"}}
                ]
            }
        ]
    };

    button = {
        html: "request",
        tag: "button",
        callbacks:[{
            event: "click",
            callback: function(){
                J.R({
                    url: "./test.php",
                    data: "milad=makomata",
                    callback: function(res) {
                        console.log(res);
                    }
                })
            }
        }]
    };
    J.C({
        ".foo":{
            border: "1px solid black",
            color: "green"
        },
        ".bar":{
            color: "blue"
        },
        ".holder": {
            border: "1px solid red",
            "min-height": "200px",
            padding: "20px",
            children: {
                ".hold1" : {
                    "min-height": "200px",
                    border: "1px outset blue",
                    width: "200px",
                    float: "left"
                },
                ".hold2" : {
                    "min-height": "200px",
                    border: "1px dotted green",
                    width: "200px",
                    float: "right"
                }
            }
        }
    });
    
    J.C().update({
        ".foo": {
            borderRadius: "5px"
        }
    });
    

    // request component test
    frame = J.R().request({
        url: "./src/components/test/",
        callback: function(e) {
            // JSON.parse(e.children[0].innerHTML);
            // q = e.children[0].innerHTML;
            // var script document.getelementbyid("scriptid");
            // script.onload= function(){ window.configData;  }
            mainContainer.element.appendChild(e.element);
        }
    });
// var ww = document.registerElement('wtf');


    // document.createElement('script').src= "./src/components/test/js.js";
    // debugger;
    mainContainer.children.push(button);
    H(mainContainer);

    // var div = document.createElement('div');
    // div.innerHTML = '<object type="text/html" data="./src/components/test/index.html"></object>';
    // debugger
    // mainContainer.element.innerHTML='<object type="text/html" data="./src/components/test/index.html"></object>';
    document.body.appendChild(mainContainer.element);
    mainContainer.element.innerHTML ="<x-foo>asdasd</x-foo>";
    // document.body.appendChild(div);
    // setTimeout(function(){

    // console.log(tpl);
    // },3000)
}
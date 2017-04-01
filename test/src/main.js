function main() {

    var H = J.H,
        DB = H().data,
        mainContainer;
    var button;
    mainContainer = {children:[
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
        }
    ]};

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
            border: "1px solid black;",
            color: "green;"
        },
        ".bar":{
            color: "blue"
        }
    });
    
    J.C().update({
        ".foo": {
            color: "red"
        }
    });
    J.C().sheet.href = "src/style.css";
    
    mainContainer.children.push(button);
    H(mainContainer);
    document.body.appendChild(mainContainer.element);
}
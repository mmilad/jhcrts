function main() {

    var H = J.H,
        DB = H().data,
        mainContainer;
    var button;
    mainContainer = {children:[
        {
            tag: "input",
            callbacks: [{
                event: "keyup",
                callback: function(){
                    DB.foo = this.value;
                }
            }]
        },{
            tag: "a",
            bind:{
                data: "foo",
                property: "innerHTML",
                attribute: "plain"
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
    }
    mainContainer.children.push(button);
    H(mainContainer);
    document.body.appendChild(mainContainer.element);
}
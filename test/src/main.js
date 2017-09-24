function init() {
    var elo = {
        attributes: {
            foo: "bar",
            goo: "gar",
            class: "foo"
        },
        properties: {
            gesicht: "fischt"
        },
        html: "fsdf",
        callbacks: [{
            event: "click",
            callback: function() {
                console.log(this)
            }
        }]
    };
    var el = J.html(elo);
    var styleConfig = {
        ".foo": {
            height: "100px",
            width: "100px",
            color: "green",
        }
    }
    var style = J.css(styleConfig);
    styleConfig.style.width = "200px";
    styleConfig.style.border = "solid 1px black";
    var getStyle = J.css.getStyle('.foo')
    // debugger
    document.body.appendChild(el)
}
window.onload = function() {
init();
}
function init() {
    var elo = {
        attributes: {
            foo: "bar",
            goo: "gar",
            class: "foo bar"
        },
        html: "foo bar",
        properties: {
            randomProp: "randomVal"
        },
        callbacks: [{
            event: "click",
            callback: function() {
                console.log(this)
            }
        }],
        children: [
            {
                html: "foo",
                attributes: {
                    class: "foo"
                }
            },
            {
                html: "bar",
                attributes: {
                    class: "bar"
                }
            }
        ]
    };
    var el = J.html(elo);
    var styleConfig = {
        ".foo": {
            height: "100px",
            width: "100px",
            color: "green",
            fontWeight: "bold",
            transition: "all 1s",
            children: {
                ".bar": {
                    color: "red",
                    transition: "all 1s"
                },
                "&.bar": {
                    color: "yellow"
                }
            }
        }
    }
    var style = J.css(styleConfig);
    styleConfig.style.width = "200px";
    styleConfig.style.border = "solid 1px black";
    var fooStyle = J.css.getStyle('.foo');
    var fooBarStyle = J.css.getStyle('.foo .bar');
    J.css.getStyle('.foo::before').content = '" foo before content"';
    J.css.getStyle('.bar::before').content = '" bar before content"';
    J.css.getStyle('.foo::after').content = '" foo after content"';
    J.css.getStyle('.bar::after').content = '" bar after content"';
    var xx = J.css.getStyle('.bar::after') 
    setInterval(function() {
        if(fooStyle.color !== "blue") {
            fooStyle.color = "blue"
        } else {
            fooStyle.color = "red"
            fooStyle.width = "200px"
        }
        if(fooBarStyle.color !== "green") {
            fooBarStyle.color = "green"
            fooStyle.width = "600px"
        } else {
            fooBarStyle.color = "purple"
        }
    }, 5000)
    document.body.appendChild(el)
}
window.onload = function() {
init();
    var currentFooStyle = J.css.getCurrentStyle('.foo');
    fooStyle.padding
    fooStyle.margin
}
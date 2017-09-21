function init() {
    var elo = {
        attributes: {
            foo: "bar",
            goo: "gar"
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
    var el = J.html.render(elo);
    document.body.appendChild(el)
}
window.onload = function() {
init();
}
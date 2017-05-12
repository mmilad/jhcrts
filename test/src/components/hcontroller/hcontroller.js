J.H().register({
    "h-controller" : {
        onSet: function(elem) {
                var newElem = {
                    class:"foo goo fete",
                    children:[
                        {
                            class: "goo",
                            html: "hello world"
                        }
                    ]
                };
                J.H(newElem);
                elem.appendChild(newElem.element)
            elem.data.onSet.push(function(e){
                console.log(e);
            });
        }
    }
})
var styleObj = {
    ".foo" : {
        border: "1px solid black",
        "background-color": "red",
        "animation-name": "milad",
        "animation-duration": "1s",
        backgroundColor: "green",
        ".gootte" : {
            border: "1px solid green",
        },
        "&.goo": {
            float:"left",
            padding: "5px",
            "&.fete": {
                padding: "50px"
            }
        },
        ".goo": {
            float:"left",
            padding: "5px",
            "&.fete": {
                padding: "50px"
            }
        }
    }
};
J.C(styleObj);
var myKeyFrame = {
    "@Keyframes milad": {
        to: {
            padding: "150px",
            "background-color": "red"
        }
    }
}
J.C({
    ".foo" : {
        "&:hover": {
            "background-color": "yellow !important"
        }
    }
});
setTimeout(function() {
J.C({
    ".foo" : {
        "&:hover": {
            "background-color": "blue"
        }
    }
});
},3000)
J.C(myKeyFrame);
J.C().getRule('.foo:hover').border = "10px solid purple";
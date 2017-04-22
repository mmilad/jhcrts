J.H().register({
    home : {
        onSet: function(elem) {
            var newElem={
                types:["block"]
            }
            J.H().addType({
                block: {
                    attributes: {
                        style: "float: left; width: 400px;"
                    },
                    children: [
                        {
                            tag: "span",
                            html: "hellp world!"
                        }
                    ]
                }
            })
            J.H(newElem)

            J.C({
                home: {
                    border: "1px solid black",
                    height: "200px",
                    width: "200px",
                    position: "absolute",
                    callback: function(e) {
                        var counter=0,
                            s=false;
                    }
                }
            });
            
            J.R({
                url:"src/test.json",
                callback: function(e) {
                    console.log(e)
                }
            });
            
            
            elem.innerHTML = "HELLO WORLD! im home";
            elem.appendChild(newElem.element)
        }
    }
})
J.H().register({
    home : {
        onSet: function(elem) {
            J.R({
                url:"src/test.json",
                callback: function(e) {
                    debugger
                }
            })
            
            J.C({
                home: {
                    border: "1px solid black",
                    height: "200px",
                    width: "200px",
                    position: "absolute",
                    callback: function(e) {
                        var counter=0,
                            s=false;
                        setInterval(function(){
                            if(!s){
                                counter++;
                                if(counter===600){s=!s}
                                e.style.left = counter+"px"
                                e.style.top = counter+"px"
                            } else {
                                counter--;
                                if(counter===0){s=!s}
                                e.style.left = counter+"px"
                                e.style.top = counter+"px"
                            }
                        }, 1)
                    }
                }
            })
            elem.innerHTML = "HELLO WORLD! im home";
        }
    }
})
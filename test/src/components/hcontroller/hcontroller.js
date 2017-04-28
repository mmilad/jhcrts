J.H().register({
    "h-controller" : {
        onSet: function(elem) {
            elem.data.onSet.push(function(e){
                console.log(e);
            });
            elem.data = {
                q: {
                    w: {
                        e: {
                            r:{
                                d:""
                            }
                        }
                    }
                },
                a:{
                    s:{
                        d:{
                            f:{
                                g:""
                            }
                        }
                    }
                }
            };
            elem.data.q.w.e.r.d;
            elem.data.a.s.d.f.g;
            debugger
            elem.data="";
            elem.innerHTML = "HELLO WORLD! im home controller";
        }
    }
})
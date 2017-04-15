new class JHCR_REQUEST_CONTROLLER {
    newDataBase:any
    get:any
    post:any
    request:Function
    loadJsFile:any
    constructor(){
        J.R = (config) => {
            var SELF = this,
                lit
            this.get = (config) => {
                var baseConfig = { type: "GET", async: true , data: null}
                for(lit in config){ baseConfig[lit] = config[lit] }
                httpGetAsync(baseConfig)
            }
            this.post = (config) => {
                var baseConfig = { type: "POST", async: true , data: null}
                for(lit in config){ baseConfig[lit] = config[lit] }
                httpGetAsync(baseConfig)
            }
            function httpGetAsync(config) {
                var xmlHttp = new XMLHttpRequest();
                
                xmlHttp.open(config.type, config.url, config.async)
                xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        config.callback(xmlHttp.responseText)
                    }
                }
                xmlHttp.send(config.data)
            }
            this.request = function(config) {
                var baseConfig = {
                        url:"",
                        prepend: {
                            js:[],
                            css:[]
                        },
                        append: {
                            js:[],
                            css:[]
                        },
                        callback: function() {

                        },
                        appendJhcr: true
                    },
                    frame;

                    SELF.loadJsFile(config.url+"html.js",function(e){
                        this;
                        console.log("loadseds")
                    })
            }
            this.loadJsFile = function(url, callback){

                var script = document.createElement("script")
                script.type = "text/javascript";
                script.onload = function(e){
                    window["config"]
                    callback(e);
                };

                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            }
            // if(config) {this.request(config)}
            return this
        }
    }
}
new class JHCR_REQUEST_CONTROLLER {
    newDataBase:any
    get:any
    post:any
    
    constructor(){
        J.R = (config) => {
            this.get = (config) => {
            var lit
                var baseConfig = { type: "GET", async: true , data: null}
                for(lit in config){ baseConfig[lit] = config[lit] }
                httpGetAsync(baseConfig)
            }
            this.post = (config) => {
            var lit
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
            if(config) {this.post(config)}
            return this
        }
    }
}
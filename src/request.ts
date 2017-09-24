class JHCR_REQUEST_CONTROLLER {
    get:any
    post:any
    request:Function
    loadJsFile:any
    constructor(){
    }
}



J.request = (config) => {
    var SELF = this
    var baseConfig = { type: "POST", async: true , data: null}
    for(let i in config){ baseConfig[i] = config[i] }
    httpGetAsync(config);
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
    return this
}
J.request.__proto__ = {
    loadJs: (config) => {
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.onload = function(e){
            window["config"]
            config.callback(e);
        };
        script.src = config.url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    build: function(config){
        var that = this
        config.run = () => {
            this(config)
        }
        return config
    }
}
J.HELPER.DATA = {};
new class JHCR_HELPER_DATABASE_CONTROLLER {
    constructor(){

        
        J.HELPER.newDataBase = (data, config) => {
            function JHCR_MagicObject(obj, p){
                var litter, that = this;
                this.isJHCR_MagicObject = true;
                this.value = obj;
                this.nodeOf = p ? p : null
                this.items = {};
                this._onGet = {};
                this._onSet = {};
                // this. = function() {

                // }
                // debugger;
                for (var name in obj) {
                    Object.defineProperty(this, name,{
                        get () {
                            for(litter in this.onGet) {
                                this.onGet[litter]()
                            };
                            return this.items[name];
                        },
                        set (e) {
                            for(litter in this.onSet) {
                                this.onSet[litter]({
                                    newVal: e,
                                    oldVal: this.value[name]
                                });
                            };
                            if(typeof e !== "object") {
                                this.value[name] = e;
                            } else {
                                this.value[name] = e;
                                this.items[name] = new JHCR_MagicObject(e, this)
                            }
                        }
                    });
                    this[name] = obj[name];
                }
            }

            return data ? new JHCR_MagicObject(data, null) : new JHCR_MagicObject({data:""}, null);
        }
        J.HELPER.DATA.newDataBase = () =>{
            return new function():void{
                var ATTACHMENTS=[],
                    BACKUP={},
                    BACKUP_VERSIONS = {},
                    DATABASE = document.createElement('select'),
                    obj:any = {};
                obj.data = DATABASE.dataset;
                obj.bind = function(config) {
                    if(!ATTACHMENTS[config.data]) {ATTACHMENTS[config.data] = [];}
                    ATTACHMENTS[config.data].push(config);
                };

                function conCamel(input) { 
                    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
                        return group1.toUpperCase();
                    });
                }
                
                function makeBackUp(dataName){
                    if(!BACKUP[dataName]){
                        BACKUP[dataName]=[]
                    }
                    BACKUP[dataName].push(obj.data[dataName])
                    BACKUP_VERSIONS[dataName]++;
                }
                function checkItem(dataName){
                    !BACKUP[dataName] ? BACKUP[dataName]=[] : false
                    !BACKUP_VERSIONS[dataName] ? BACKUP_VERSIONS[dataName]=0 : false
                }
                function init(db) {
                    var docObserver = new MutationObserver(function(mutations) {     
                        var key,itemFound;
                        mutations.forEach(function(mutation){
                            key = conCamel(mutation.attributeName.substring(5));
                            checkItem(key)
                            if(ATTACHMENTS[key]) {
                                ATTACHMENTS[key].forEach(function(config){
                                    if(config.element) {
                                        if(config.attribute) {
                                            if(config.attribute === "plain") {
                                                if(BACKUP_VERSIONS[key] !==0) {
                                                    var lastVersion = BACKUP[key][BACKUP_VERSIONS[key]-1],
                                                        lastValue = config.element.getAttribute(lastVersion);
                                                    if(lastValue) {lastValue=''}
                                                    config.element.removeAttribute(lastVersion)
                                                    config.element.setAttribute(db[key], lastValue)
                                                } else {
                                                    config.element.setAttribute(db[key], '')
                                                }
                                            }
                                        }
                                        if(config.property){
                                            config.element[config.property] = db[key]
                                        }
                                    }
                                    if(config.find) {
                                        itemFound = document.querySelectorAll(config.find);
                                        itemFound.forEach(function(itemInstance){
                                            if(config.attribute) {
                                                itemInstance.setAttribute(config.attribute, db[key]);
                                            }
                                            if(config.property){
                                                itemInstance[config.property] = db[key];
                                            }
                                        });
                                    }
                                    !config.callback ? false : config.callback(db[key])
                                    makeBackUp(key);
                                });
                            }
                        });
                    });
                    docObserver.observe(DATABASE, { attributes: true});
                }
                init(DATABASE.dataset);
                return obj;
            }
        }
        J.HELPER.DATA.db = function() {
        }
    }
}
# jhcrts

### J.H(config)

config eill get the property "element" after this call when config is an object or string
the object variant can have following properties:

- tag // will decide wich element will be created on config.element
- value // will set config.element.value (shorthand)
- html // will set config.element.innerHTML (shorthand)
- class // will set config.element.className (shorthand)
- attributes // an object with entries such as "id":"foo", "style":"float:left;", "myCustoVal". will set the attriebutes of config.element
- properties // an object with any entry like "innerHTML":"foo" or "elemCallBack":"function(){console.log(thid)}
- children // an array of objects wich can have simular configuration
- callbacks // an array of object with 2 values (event, callback)
- bind // a bit confusing atm ill get later to this one
- types // an array of key for default configuraions settet with J.H().addTpee(typeconfig

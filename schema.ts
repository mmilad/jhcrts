var J:any = {
    HELPER: {},
    registry : {}
}
var JHCRdocObserver = new MutationObserver(function(mutations) {     
    // var key,itemFound;
    this;
    mutations.forEach(function(mutation) {
        for(var i in mutation.addedNodes) {
            if(J.registry[mutation.addedNodes[i].localName] && J.registry[mutation.addedNodes[i].localName].onAdd) {
                    J.registry[mutation.addedNodes[i].localName].onAdd(mutation.addedNodes[i]);
            }
        }
        for(var i in mutation.removedNodes) {
            if(J.registry[mutation.removedNodes[i].localName] && J.registry[mutation.removedNodes[i].localName].onRemove) {
                    J.registry[mutation.removedNodes[i].localName].onRemove(mutation.removedNodes[i]);
            }
        }
    });
});
JHCRdocObserver.observe(document, { childList:true, subtree:true});
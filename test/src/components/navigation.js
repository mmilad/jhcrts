J.H().register({
    "j-nav" : {
        onSet: function(J_NAV) {
            var showElement = {};
            J.H(showElement);
            showElement=showElement.element
            document.body.appendChild(showElement);
            if(!J_NAV.data.data) { J_NAV.data.set ="data"; }
            J_NAV.data.data.onSet.push(
                function(e) {
                    renderNavi(e.value);
                }
            );
            
             J_NAV.data.data = [
                {
                    label: "home",
                    location: "home",
                    component: "home"
                },
                {
                    label: "H Controller",
                    location: "about",
                    component: "h-controller"
                }
            ];
            function renderNavi(ary) {
                var nav =  {
                    tag: "ul",
                    children: []
                };
                ary.forEach(function(item) {
                   nav.children.push({
                       tag:"li",
                       children:[
                           {
                               tag: "a",
                               attributes: {
                                   href: "#"
                               },
                               html: item.label,
                               callbacks: [
                                   {
                                       event: "click",
                                       callback: function () {
                                           var newView = {tag: item.component};
                                           J.H(newView);
                                           showElement.innerHTML = "";
                                           showElement.appendChild(newView.element)
                                       }
                                   }
                               ]
                           }
                       ]
                   })
                });
                J.H(nav);
                J_NAV.innerHTML ="";
                J_NAV.appendChild(nav.element)
            }

        }
    }
})
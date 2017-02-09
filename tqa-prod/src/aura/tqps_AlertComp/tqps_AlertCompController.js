({
	hideAlert : function(component) {
		component.set("v.displayFlag",false);
	},
    
    manageAlert : function(component,event){
        var param = event.getParam('alertPacket');
        
        var positionParam = event.getParam('alertPosition');
        var alertPosition = component.get("v.position");
        
        if(!param.displayFlag){
            component.set("v.displayFlag",param.displayFlag);
        }
        if(alertPosition == positionParam){
            component.set("v.displayFlag",param.displayFlag);
            component.set("v.message",param.message);
            component.set("v.type",param.type);
            event.stopPropagation();
        } 
    },
})
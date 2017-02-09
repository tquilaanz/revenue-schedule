({
	closeFilter : function(component, event) {
		var closeFilterEvent = component.getEvent("hideFilter");
        closeFilterEvent.fire();	
	},
     
    applySchedule : function(component,event,helper){
    	helper.applySchedule(component);    
    },  
})
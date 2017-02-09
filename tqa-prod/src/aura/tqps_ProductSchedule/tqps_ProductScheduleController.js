({
	addNewSchedule : function(component, event, helper) {
		var newScheduleEvent = component.getEvent("newSchedule");
        newScheduleEvent.fire();
	},
    
    removeSchedule : function(component, event, helper) {
		var index = component.get("v.index");
        
        var removeScheduleEvent = component.getEvent("removeSchedule");
        removeScheduleEvent.setParams({index:index});
        removeScheduleEvent.fire();
        
	},
    
    hightlightRequiredField: function(component,event,helper){
    	helper.hightlightRequiredField(component);
    }
})
({
	handleInit : function(component, event, helper) {
        helper.checkProductScheduling(component);
    },
    
    addNewRow : function (cmp,event){
        var lineItemId = cmp.get("v.recordId");
        var schedulesList = cmp.get("v.schedules");
        var schedules = schedulesList.slice();
        
        var scheduleType = cmp.get("v.scheduleType");
        
        if(scheduleType == 0)
            schedules.push({'attributes': {'type': 'OpportunityLineItemSchedule'},'OpportunityLineItemId':lineItemId,'ScheduleDate' :'','Type':'Revenue','Revenue':0,'Description': ''});
        else if(scheduleType == 1)
            schedules.push({'attributes': {'type': 'OpportunityLineItemSchedule'},'OpportunityLineItemId':lineItemId,'ScheduleDate' :'','Type':'Quantity','Quantity':0,'Description': ''});
          
        else if(scheduleType == 2)
            schedules.push({'attributes': {'type': 'OpportunityLineItemSchedule'},'OpportunityLineItemId':lineItemId,'ScheduleDate' :'','Type':'Both','Revenue':0,'Quantity':0,'Description': ''});
      
        cmp.set("v.schedules",schedules);
    },
    
    removeRow : function (cmp,event){
        var index = event.getParam("index");
        var schedulesList = cmp.get("v.schedules");
        schedulesList.splice(index,1)
        cmp.set("v.schedules",schedulesList);
    },
    
    waitingForResponse : function(component,event){
        var spinner = component.find('spinner');
        $A.util.removeClass(spinner,"no-show");    
    },
    
    responseReceived : function(component,event){
        var spinner = component.find('spinner');
        $A.util.addClass(spinner,"no-show");    
    },
    
    saveSchedules : function(component,event,helper){
        helper.hideAlert();
        helper.showFilterSection(component,true);
        helper.saveSchedules(component);
    },
    cancelSchedules : function(component,event,helper){
        helper.hideAlert();
        helper.showFilterSection(component,true);
    	helper.fetchSchedules(component);
    },
    
    showFilterSection : function(component,event,helper){
        helper.showFilterSection(component);
    },
    
    changeFilterIconColor : function(cmp,event,helper){
        helper.showFilterSection(cmp,true);
        event.stopPropagation();
    },
    
    applyNewSchedule : function(cmp,event,helper){
        helper.hideAlert();
        helper.showFilterSection(cmp,true);
        helper.applySchedules(cmp,event);
    },
    
    recalculateSchedule: function(component,event,helper){
        var schedules = component.get("v.schedules");
        var scheduleType = component.get("v.scheduleType");
        helper.calculateTotal(component,schedules,scheduleType);
        event.stopPropagation();
    }
    
})
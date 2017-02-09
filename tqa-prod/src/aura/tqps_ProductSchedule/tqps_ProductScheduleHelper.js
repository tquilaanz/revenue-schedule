({
	hightlightRequiredField : function(component) {
		var schedule =  component.get("v.schedule");
        if(schedule){
            var scheduleType = component.get("v.scheduleType");
            
            var scheduleDateInput = component.find("scheduleDate");
            if($A.util.isUndefinedOrNull(schedule.ScheduleDate) || schedule.ScheduleDate =='')
                $A.util.addClass(scheduleDateInput,"requiredFilter");      
            else
                $A.util.removeClass(scheduleDateInput,"requiredFilter");
            
            if(scheduleType == '0' || scheduleType == '2'){
                var revenueInput = component.find("revenue");
                
                if($A.util.isUndefinedOrNull(schedule.Revenue))
                    $A.util.addClass(revenueInput,"requiredFilter"); 
                else
                    $A.util.removeClass(revenueInput,"requiredFilter");     
            }
            
            if(scheduleType == '1' || scheduleType == '2'){
                var quantityInput = component.find("quantity");
                if($A.util.isUndefinedOrNull(schedule.Quantity))  
                    $A.util.addClass(quantityInput,"requiredFilter");    
                else
                    $A.util.removeClass(quantityInput,"requiredFilter");
            } 	
        }
	}
})
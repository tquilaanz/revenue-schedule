({
	removeRequierdClass : function(filterElement){
    	if($A.util.hasClass(filterElement,"requiredFilter")){
        	$A.util.removeClass(filterElement,"requiredFilter");	   
        }
	},

    hideAlert : function(){

        var alertEvent =  $A.get("e.c:tqps_AlertEvent"); 
        var alertMessage = {displayFlag : false};
        alertEvent.setParams({alertPacket : alertMessage});
        alertEvent.fire();
    },
    
    displayAlert : function(component,displayFlag,type,message){

        var alertEvent =  $A.get("e.c:tqps_AlertEvent"); 
        var alertMessage; 
        
        if(displayFlag)
        	alertMessage = {type: type , displayFlag : true, message:message};
        else
            alertMessage = {displayFlag : false};
        
        alertEvent.setParams({alertPacket : alertMessage,alertPosition : 'filterHeader'});
        alertEvent.fire();
    },
    
    applyRevenueSchedule : function(component,schedulePayload){
        var applyNewScheduleEvent = component.getEvent("applyNewSchedule");
		applyNewScheduleEvent.setParams({schedulePacket : schedulePayload});
        applyNewScheduleEvent.fire();
    },
    
    applySchedule : function(cmp){
        this.hideAlert();    	
        var filters = cmp.find("revenueFilter");
        
        //Add to array if a single filter is found
		if(!filters.length)
        	filters = [filters];
        
		//Get the revenue filter type
        var filterType = cmp.get("v.revenueFilter");
        var errorFlag = false;
        
        var schedulePayload = [];
        
    	for(var filterIndex=0; filterIndex<filters.length; filterIndex++){
            var filterComponent = filters[filterIndex];
            var revenue;
            var quantity;
            var installmentPeriod;
            var installments;
            var startDate;
            var scheduleType;

            if(filterType == '1' || filterType == '2'){
                quantity = filterComponent.find("filter-quantity");
                if(quantity){
                    this.removeRequierdClass(quantity);
                    scheduleType='Quantity';
                    if($A.util.isUndefinedOrNull(quantity.get("v.value")) || quantity.get("v.value") <= 0 ){
                        $A.util.addClass(quantity,"requiredFilter");
                        errorFlag = true; 
                    }
                }
            } 
            if(filterType == '0' || filterType == '2'){
                revenue = filterComponent.find("filter-revenue")
                if(revenue){
                    this.removeRequierdClass(revenue);
                    scheduleType='Revenue';
                    if($A.util.isUndefinedOrNull(revenue.get("v.value")) || revenue.get("v.value") <=0 ){
                        $A.util.addClass(revenue,"requiredFilter");
                        errorFlag = true;
                    }
                }
            }
            
            installmentPeriod = filterComponent.find("filter-installmentPeriod");
            this.removeRequierdClass(installmentPeriod);
            installments = filterComponent.find("filter-installments");
            this.removeRequierdClass(installments);
            startDate = filterComponent.find("filter-startDate");
            this.removeRequierdClass(startDate);

            if($A.util.isUndefinedOrNull(startDate.get("v.value"))){
                $A.util.addClass(startDate,"requiredFilter");  
                errorFlag = true;
            }
            if(installmentPeriod.get("v.value") === '--None--'){
                $A.util.addClass(installmentPeriod,"requiredFilter"); 
                errorFlag = true;
            } 
            if($A.util.isUndefinedOrNull(installments.get("v.value")) || installments.get("v.value") == 0){
                $A.util.addClass(installments,"requiredFilter");
                errorFlag = true;
            }
            if(!errorFlag){
                if(scheduleType=='Quantity'){
                    schedulePayload.push({type : scheduleType, installments : installments.get("v.value"), installmentPeriod : installmentPeriod.get("v.value"), startDate : startDate.get("v.value"), quantity : quantity.get("v.value")});    
                }
                else if(scheduleType == 'Revenue'){
                    schedulePayload.push({type : scheduleType, installments : installments.get("v.value"), installmentPeriod : installmentPeriod.get("v.value"), startDate : startDate.get("v.value"), revenue : revenue.get("v.value")}); 
                }
            }
        }
        if(errorFlag){
            this.displayAlert(cmp,true,'error','All fields are mandatory!!');
        }
        else{
            console.log('did you manage to get here');
            this.applyRevenueSchedule(cmp,schedulePayload);
            console.log('did you manage to get here');
        }    
    },
    
})
({
    fetchSchedules : function(component){
        var lineItemId = component.get("v.recordId");
        var enabledSchedulingType = component.get("v.enabledSchedulingType");
        console.log(enabledSchedulingType);
        if(lineItemId){

            var getSchedulesAction = component.get("c.getExistingProductSchedules");
            getSchedulesAction.setParams({lineItemId:lineItemId});
            getSchedulesAction.setCallback(this,function(response){
                var state = response.getState();
                if(state === 'SUCCESS'){
                    var schedules = response.getReturnValue();
                    schedules = JSON.parse(schedules);
                    if(schedules.length == 0){
                        this.showFilterSection(component,false);
                    	if(enabledSchedulingType == 0 || enabledSchedulingType == 2 )
                      		component.set("v.schedules",[{"attributes": {"type": "OpportunityLineItemSchedule"},'OpportunityLineItemId':lineItemId,'ScheduleDate' :'','Type' :'Revenue','Revenue':0,'Description': ''}]);	
                        else if(enabledSchedulingType == 1){
                            component.set("v.schedules",[{"attributes": {"type": "OpportunityLineItemSchedule"},'OpportunityLineItemId':lineItemId,'ScheduleDate' :'','Type' :'Quantity','Quantity':0,'Description': ''}]);
                        	component.set("v.scheduleType",1);
                        }
                    }
                    else{
            			var scheduleType = schedules[0].Type;
                        this.calculateTotal(component,schedules,scheduleType);
                        this.setScheduleType(component,scheduleType);
                        component.set("v.schedules",schedules); 
                    }
                }
            })
            $A.enqueueAction(getSchedulesAction); 
        }
    },
    checkProductScheduling : function(component){

        var lineItemId = component.get("v.recordId");
        if(lineItemId){ 
            var getProductSchedulingAction = component.get("c.checkProductScheduling");
            getProductSchedulingAction.setParams({lineItemId:lineItemId});
            getProductSchedulingAction.setCallback(this,function(response){
                var state = response.getState();
                console.log(state);
                if(state === 'SUCCESS'){
                    var schedules = response.getReturnValue();
                    var scheduleState = JSON.parse(schedules);
                    
                    if(!scheduleState.productScheduleEnabled){
                        this.displayAlert(component,true,'error','Product scheduling is not enabled in the org. Please contact your system administrator for enabling it !');
                    }
                    else{
                        
                        if(scheduleState.revenueScheduleEnabledForProduct){
                            component.set('v.enabledSchedulingType',0);
                        }
                        if(scheduleState.quantityScheduleEnabledForProduct){
                            component.set('v.enabledSchedulingType',1);
                        }
                        if(scheduleState.revenueScheduleEnabledForProduct && scheduleState.quantityScheduleEnabledForProduct){
                            component.set('v.enabledSchedulingType',2);
                        }
                        
                        if(!(scheduleState.revenueScheduleEnabledForProduct || scheduleState.quantityScheduleEnabledForProduct)){
                            this.displayAlert(component,true,'error','Any type of Product scheduling is not enabled for the selected Product. Please contact your system administrator for enabling it !');
                        }
                        this.fetchSchedules(component);
                    }
                }
                else{
                    console.log(response.getError);
                    this.displayAlert(component,true,'error','Following error occurred - '+response.getError());
                }
            })
            $A.enqueueAction(getProductSchedulingAction);
        }
    },
    
    calculateTotal : function(component,schedules,scheduleType){
        var quantityTotal= 0;
        var revenueTotal = 0;
        
        for(var i=0;i<schedules.length;i++){
            var schedule = schedules[i];

            if((scheduleType=='Revenue' || scheduleType=='Both' || this.revenueScheduleType(scheduleType)) && !$A.util.isUndefinedOrNull(schedule.Revenue) ){
                revenueTotal += schedule.Revenue;	    
            }   
            if((scheduleType=='Quantity' || scheduleType=='Both' || this.quantityScheduleType(scheduleType)) && !$A.util.isUndefinedOrNull(schedule.Quantity)){
                quantityTotal += schedule.Quantity;   
            }
        }
        component.set("v.quantityTotal",quantityTotal);
        component.set("v.revenueTotal",revenueTotal);
    },
    setScheduleType : function(component,scheduleType){

        if(scheduleType=='Revenue')
            component.set("v.scheduleType",0);
        
        else if(scheduleType=='Quantity')
            component.set("v.scheduleType",1);
        
        else if(scheduleType=='Both')
            component.set("v.scheduleType",2)
        
    },
    
    errorFlag : false,
    
    saveSchedules : function(component){
		var schedules = component.get("v.schedules");
        var lineItemId = component.get("v.recordId");
        var errorFlag = false;
        var scheduleType = component.get("v.scheduleType");

        var scheduleRows = component.find("scheduleRow");
        console.log(scheduleRows);
        
        //Add to array if a single filter is found
		if(!scheduleRows.length)
        	scheduleRows = [scheduleRows];
        
        this.errorFlag = false;
    	for(var rowIndex=0; rowIndex<scheduleRows.length; rowIndex++){
        	var scheduleRow = scheduleRows[rowIndex];
            var schedule = scheduleRow.get("v.schedule");
			
            if($A.util.isUndefinedOrNull(schedule.ScheduleDate) || schedule.ScheduleDate ==''){
            	this.highlightRequiredField(scheduleRow,"scheduleDate");	
            }
            
            if(this.revenueScheduleType(scheduleType) && $A.util.isUndefinedOrNull(schedule.Revenue) ){
                this.highlightRequiredField(scheduleRow,"revenue");	    
            }   

            if(this.quantityScheduleType(scheduleType) && $A.util.isUndefinedOrNull(schedule.Quantity)){
                this.highlightRequiredField(scheduleRow,"quantity");    
            }  
        }
		console.log(this.errorFlag);
        if(!this.errorFlag){
            var action = component.get("c.updateSchedules");
            action.setParams({schedulesList:JSON.stringify(schedules),lineItemId:lineItemId});
            action.setCallback(this,function(response){
                var state = response.getState();
                if(state === 'SUCCESS'){
                    if(response.getReturnValue() == 'SUCCESS')
                   		this.displayAlert(component,true,'success','Revenue schedules are saved successfully !!');
                    else{
                        //Class handled exception
                    	this.displayAlert(component,true,'error','Following error occurred - '+response.getReturnValue());    
                    }
                }
                else{
                    console.log(response.getError());
                    this.displayAlert(component,true,'error','Following error occurred - '+response.getError());
                }     
            })
            $A.enqueueAction(action);  
        }
        else{
        	this.displayAlert(component,true,'error','All highlighted fields are mandatory. Put quantity/revenue as 0 if not applicable !!');    
        }
        
    },
        
    highlightRequiredField : function(scheduleRow,elementName){
        var inputElement = scheduleRow.find(elementName);
        $A.util.addClass(inputElement,"requiredFilter"); 
        this.errorFlag = true;
    },
	
    quantityScheduleType : function(scheduleType){
    	if(scheduleType == '1' || scheduleType == '2')  
            return true;
        else
            return false;    
    },
    revenueScheduleType : function(scheduleType){
    	if(scheduleType == '0' || scheduleType == '2')  
            return true;
        else
            return false;
    },
    
    applySchedules : function(cmp,event){
        var params = event.getParam('schedulePacket');
        var lineItemId = cmp.get("v.recordId");
        var applyScheduleAction = cmp.get("c.applyNewSchedules");
        applyScheduleAction.setParams({schedulePacket : JSON.stringify(params), lineItemId : lineItemId});
        
        applyScheduleAction.setCallback(this,function(response){
            var state = response.getState();
            
            if(state === 'SUCCESS'){
                var schedules = response.getReturnValue();
                schedules = JSON.parse(schedules);
                
                var scheduleType = schedules[0].Type;
                this.setScheduleType(cmp,scheduleType);
                console.log(schedules);
                cmp.set("v.schedules",schedules); 
                this.displayAlert(cmp,true,'success','Revenue schedules are applied. Click save to commit to Product Revenue schedule !!');
            }
        })
        $A.enqueueAction(applyScheduleAction);
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
        
        alertEvent.setParams({alertPacket : alertMessage,alertPosition : 'appHeader'});
        alertEvent.fire();
    },
    
    showFilterSection : function(component,displayFlag){
        
        var filterIconComp = component.find("filterIcon");
        var prefix = 'slds-';
        var category = filterIconComp.get("v.category"); 
        var containerEmailClass = prefix+"icon-"+category+"-email";
        var containerShareClass = prefix+"icon-"+category+"-share";
        var displayFilter;
        
        if(displayFlag){
            $A.util.addClass(filterIconComp,containerEmailClass);
            $A.util.removeClass(filterIconComp,containerShareClass);
            displayFilter = displayFlag;
        }   
        else{
    		displayFilter = component.get("v.displayFilter"); 
            $A.util.toggleClass(filterIconComp,containerEmailClass);
            $A.util.toggleClass(filterIconComp,containerShareClass);
        }
        component.set("v.displayFilter",!displayFilter);
    },
    
})
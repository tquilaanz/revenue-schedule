public With Sharing class tqps_ProductScheduleController {
    
    @auraEnabled
    Public Static String checkProductScheduling(String lineItemId){
        tqps_ProductScheduleServices.ScheduleState state = tqps_ProductScheduleServices.checkRevenueSchedulingForOrg();
        
        if(state.productScheduleEnabled){
            
            String opportunityLineItemQuery = 'Select Product2.Name, Product2Id';
            if(state.revenueScheduleEnabledInOrg){
                opportunityLineItemQuery += ',Product2.CanUseRevenueSchedule';
            }
            
            if(state.quantityScheduleEnabledInOrg){
                opportunityLineItemQuery += ',Product2.CanUseQuantitySchedule';
            }
            opportunityLineItemQuery +=  ' From OpportunityLineItem'
                                        +' Where id=:lineItemId' 
                                        +' Limit 1';
            
            List<OpportunityLineItem> lineItem = (List<OpportunityLineItem>)Database.query(opportunityLineItemQuery);
                                        
            if(!lineItem.isEmpty()){
                if(state.revenueScheduleEnabledInOrg && Boolean.valueOf(lineItem[0].getSobject('Product2').get('CanUseRevenueSchedule'))){
                    state.revenueScheduleEnabledForProduct = true;
                }
                
                if(state.quantityScheduleEnabledInOrg && Boolean.valueOf(lineItem[0].getSobject('Product2').get('CanUseQuantitySchedule'))){
                    state.quantityScheduleEnabledForProduct = true;
                }
            }
        }
        return JSON.serialize(state);
    }
 
    @auraEnabled
    Public Static String getExistingProductSchedules(String lineItemId){
        List<sObject> schedules = new List<sObject>();
        
        String productScheduleQuery = 'Select Quantity, Revenue, ScheduleDate, Description,OpportunityLineItemId,Type '
                                     +' From OpportunityLineItemSchedule '
                                     +' Where OpportunityLineItemId=:lineItemId '
                                     +' Order BY ScheduleDate ';
        sObject schedule;
        for(sObject scheduleRec : Database.query(productScheduleQuery)){
            //Clone record without Id
            schedule = scheduleRec.clone(false,true);   
            schedules.add(schedule); 
        }
          
        return JSON.serialize(schedules);
    }
    
    
    @auraEnabled
    Public Static String updateSchedules(String schedulesList,String lineItemId){
        SavePoint savingUpdateSP;
        try{
            savingUpdateSP = Database.setSavepoint();
            String deleteScheduleQuery = 'Select Quantity, Revenue, ScheduleDate, Description '
                                        +' From OpportunityLineItemSchedule '
                                        +' Where OpportunityLineItemId=:lineItemId';
            
            Delete (Database.query(deleteScheduleQuery));
            
            system.debug(schedulesList);
            List<sObject> schedules = (List<sObject>) JSON.deserialize(schedulesList, List<sObject>.class);

            insert schedules;
            
        }Catch(Exception e){
            Database.rollback( savingUpdateSP );
            system.debug(e.getMessage());
            return e.getMessage();
        }

        return 'SUCCESS';   
    }
    
    @auraEnabled
    Public Static String applyNewSchedules(String schedulePacket,String lineItemId){
    
        Schema.sObjectType scheduleToken = tqps_ProductScheduleServices.getObjectToken('OpportunityLineItemSchedule');
        
        if(scheduleToken !=Null){
        
            Map<Date,sObject> schedulesMap = new Map<Date,sObject>();
            List<tqps_ProductSchedulerStructure.tqps_ScheduleFilter> filters = (List<tqps_ProductSchedulerStructure.tqps_ScheduleFilter>)JSON.deserialize(schedulePacket, List<tqps_ProductSchedulerStructure.tqps_ScheduleFilter>.class);
            String scheduleType ;
            
            if(filters.size()>1)
                scheduleType = 'Both';
            
            for(tqps_ProductSchedulerStructure.tqps_ScheduleFilter filter : filters)
                schedulesMap = tqps_ProductScheduleServices.createSchedules(filter,schedulesMap,scheduleType,lineItemId,scheduleToken);
    
            return JSON.serialize(schedulesMap.values());
        }
        return Null;
    }
    
    
}
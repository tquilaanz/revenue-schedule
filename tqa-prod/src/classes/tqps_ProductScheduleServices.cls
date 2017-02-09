Public With Sharing Class tqps_ProductScheduleServices{
    
    Static FINAL String QUANTITY_SCHEDULE_TYPE = 'Quantity';
    Static Final String REVENUE_SCHEDULE_TYPE = 'Revenue';
    Static Final String QUANTITY_REVENUE_SCHEDULE_TYPE = 'Both';
    
    Static Final String WEEKLY_SCHEDULE = 'weekly';
    Static Final String DAILY_SCHEDULE = 'daily';
    Static Final String MONTHLY_SCHEDULE = 'monthly';
    Static Final String QUARTERLY_SCHEDULE = 'quarterly';
    Static Final String YEARLY_SCHEDULE = 'yearly';
    
    /*
    * Purpose - Purpose of this method is to return the next schedule date, based on the Installment Period
    *
    */
    Public Static Date resolveInstallmentPeriod(Date scheduleDate,String installmentPeriod){
    
        if(installmentPeriod.equalsIgnoreCase(DAILY_SCHEDULE))
            return scheduleDate.addDays(1);
        else if(installmentPeriod.equalsIgnoreCase(WEEKLY_SCHEDULE))
            return scheduleDate.addDays(7);
        else if(installmentPeriod.equalsIgnoreCase(MONTHLY_SCHEDULE))
            return scheduleDate.addMonths(1);
        else if(installmentPeriod.equalsIgnoreCase(QUARTERLY_SCHEDULE))
            return scheduleDate.addMonths(3);
        else if(installmentPeriod.equalsIgnoreCase(YEARLY_SCHEDULE))
            return scheduleDate.addYears(1);
        return null;
    }
    
    Public Static Schema.SObjectType getObjectToken(String objectName){
        Schema.SObjectType objectToken = Schema.getGlobalDescribe().get(objectName);
        return objectToken; 
    }
    
    Public Static Map<Date,sObject> createSchedules(tqps_ProductSchedulerStructure.tqps_ScheduleFilter filter, Map<Date,sObject> schedulesMap, String revenueType, Id lineItemId, Schema.SObjectType objectToken){

        Date startDate = filter.startDate;
        Integer installment;
        Integer lastMonthInstallment;
        
        
        if(filter.type== REVENUE_SCHEDULE_TYPE){
            installment = (Integer)(filter.revenue/filter.installments).round(System.RoundingMode.DOWN);
            lastMonthInstallment = (Integer)(filter.revenue - (installment*(filter.installments-1)));  
        }
        
        else IF(filter.type == QUANTITY_SCHEDULE_TYPE){
            installment = (filter.quantity/filter.installments);
            lastMonthInstallment = filter.quantity - (installment*(filter.installments-1));    
        }
        
        if(String.isBlank(revenueType))
            revenueType = filter.type;
        
        for( Integer scheduleIndex = 0; scheduleIndex<filter.installments; scheduleIndex++){
            
            sObject schedule = objectToken.newsObject();
            if(schedulesMap.containsKey(startDate)){
                schedule = schedulesMap.get(startDate);
                
                if(schedule.get('Revenue') == Null)
                    schedule.put('Revenue',0);
            }
            else{
                schedule = objectToken.newsObject();
                schedule.put('ScheduleDate', startDate);
                schedule.put('OpportunityLineItemId',lineItemId);
                schedule.put('Type',revenueType);
            }
            schedulesMap.put(startDate, schedule);
            startDate = resolveInstallmentPeriod(startDate,filter.installmentPeriod);

            if(filter.type== REVENUE_SCHEDULE_TYPE){
                
                if(scheduleIndex < filter.installments-1)
                    schedule.put('Revenue',installment);
                else
                    schedule.put('Revenue',lastMonthInstallment);
                if(revenueType == QUANTITY_REVENUE_SCHEDULE_TYPE && schedule.get('Quantity') == Null)
                    schedule.put('Quantity',0);
            }
            else{
                if(scheduleIndex < filter.installments-1)
                    schedule.put('Quantity',installment);
                else
                    schedule.put('Quantity',lastMonthInstallment);  
                
                if(revenueType == QUANTITY_REVENUE_SCHEDULE_TYPE && schedule.get('Revenue')== Null)
                    schedule.put('Revenue',0);
            }
        }        
        return schedulesMap;
    }
    
    
    public static ScheduleState checkRevenueSchedulingForOrg() {
        ScheduleState state = new ScheduleState();
        Schema.DescribeSObjectResult describeSObjectResult = Product2.SObjectType.getDescribe();
        
        if(describeSObjectResult.fields.getMap().containsKey('CanUseRevenueSchedule')){
            state.revenueScheduleEnabledInOrg = true;    
        }
        if(describeSObjectResult.fields.getMap().containsKey('CanUseQuantitySchedule')){
            state.quantityScheduleEnabledInOrg = true;    
        }
        
        if(state.quantityScheduleEnabledInOrg || state.revenueScheduleEnabledInOrg){
            state.productScheduleEnabled = true;    
        }
        return state;
    }
    
    Public Class ScheduleState{
        Public Boolean revenueScheduleEnabledInOrg = false;
        Public Boolean revenueScheduleEnabledForProduct = false;
        Public Boolean quantityScheduleEnabledInOrg = false;
        Public Boolean quantityScheduleEnabledForProduct = false;
        Public Boolean productScheduleEnabled = false;
    }
}
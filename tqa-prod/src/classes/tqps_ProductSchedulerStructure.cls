Public With Sharing Class tqps_ProductSchedulerStructure{
    
    Public Class tqps_ScheduleFilter{
        Public String type;
        Public Decimal revenue;
        Public Integer quantity;
        Public Date startDate;
        Public String installmentPeriod;
        Public Integer installments;
    }
    
    Public Class tqps_ScheduleState{
        Public Boolean revenueScheduleEnabledInOrg = false;
        Public Boolean revenueScheduleEnabledForProduct = false;
        Public Boolean quantityScheduleEnabledInOrg = false;
        Public Boolean quantityScheduleEnabledForProduct = false;
        Public Boolean productScheduleEnabled = false;
    }

}
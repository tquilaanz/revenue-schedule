@isTest
Public Class tqps_ProductScheduleControllerTest{
    
    @testSetup
    Static void init(){
        Account newAcc = tqps_TestDataFactory.setupAccount('New Account',True);
        
        Opportunity newOpp = tqps_TestDataFactory.setupOpportunity('New Opps',newAcc.Id, 'Prospecting', True);
        
        Product2 newProduct = tqps_TestDataFactory.setupProduct('New Product',True,True,True);
        
        PriceBookEntry newPBE = tqps_TestDataFactory.setupPriceBookEntry(newProduct.Id,70,True);
        
        OpportunityLineItem newOLI = tqps_TestDataFactory.setupOppLineItem(newPBE.Id, newOpp.Id, 70, 5, True);
    }

    Static TestMethod void checkProductSchedulingTest(){
    
        List<OpportunityLineItem> oppLineItem = [Select Id
                                                   From OpportunityLineItem
                                                  Limit 1];
        
        System.assertEquals(oppLineItem.size(),1);   
                                              
        try{                                     
            tqps_ProductScheduleController.checkProductScheduling(oppLineItem[0].Id);   
        
        }Catch(Exception e){
            
        }
        
    }
    
    Static TestMethod void ScheduleTest(){
        
        List<OpportunityLineItem> oppLineItem = [Select Id
                                                   From OpportunityLineItem
                                                  Limit 1];
        
        System.assertEquals(oppLineItem.size(),1);
        
        List<tqps_ProductSchedulerStructure.tqps_ScheduleFilter> filters = new List<tqps_ProductSchedulerStructure.tqps_ScheduleFilter>();
        tqps_ProductSchedulerStructure.tqps_ScheduleFilter filter = new tqps_ProductSchedulerStructure.tqps_ScheduleFilter();
        filter.type = 'Both';
        filter.revenue = 1200;
        filter.startDate = System.today();
        filter.installmentPeriod = 'Weekly';
        filter.installments = 8;
        
        filters.add(filter);
        
        filter = new tqps_ProductSchedulerStructure.tqps_ScheduleFilter();
        filter.type = 'Both';
        filter.quantity = 12;
        filter.startDate = System.today();
        filter.installmentPeriod = 'Weekly';
        filter.installments = 8;
        filters.add(filter);
        
        String filterString = JSON.serialize(filters);
        
        Try{
            String schedules = tqps_ProductScheduleController.applyNewSchedules(filterString,oppLineItem[0].Id);
            
            tqps_ProductScheduleController.updateSchedules(schedules,oppLineItem[0].Id);
            
            tqps_ProductScheduleController.getExistingProductSchedules(oppLineItem[0].Id);
        }Catch(Exception e){
        
        }
    }
    
    
    Static TestMethod void servicesResovleInstallmentPeriodTest(){
        Date scheduleDate = tqps_ProductScheduleServices.resolveInstallmentPeriod(System.today(),'Daily');
        System.assertEquals(system.today().addDays(1),scheduleDate);
        
        scheduleDate = tqps_ProductScheduleServices.resolveInstallmentPeriod(System.today(),'Monthly');
        System.assertEquals(system.today().addMonths(1),scheduleDate);
        
        scheduleDate = tqps_ProductScheduleServices.resolveInstallmentPeriod(System.today(),'Quarterly');
        System.assertEquals(system.today().addMonths(3),scheduleDate);
        
        scheduleDate = tqps_ProductScheduleServices.resolveInstallmentPeriod(System.today(),'Yearly');
        System.assertEquals(system.today().addYears(1),scheduleDate);
    }
   
        
}
@isTest
Public Class tqps_TestDataFactory{
    
    Public Static Account setupAccount(String accountName, Boolean insertFlag){
        Account acc = new Account();
        acc.Name = accountName;
        if(insertFlag)
            insert acc;
        
        return acc;
    }
    
    Public Static Opportunity setupOpportunity(String oppName, String accountId, String oppStage, Boolean insertFlag){
        Opportunity opp = new Opportunity();
        opp.Name = oppName; //'NewOpp';
        opp.AccountId = accountId;

        opp.StageName = oppStage; //'Prospecting';
        opp.CloseDate=Date.today().addDays(10);
        
        if(insertFlag)
            insert opp;
        
        return opp;
    }

    Public Static Product2 setupProduct(String productName, Boolean canUserRevenueSchedule, Boolean canUseQuantitySchedule, Boolean insertFlag){
        
        Schema.DescribeSObjectResult describeSObjectResult = Product2.SObjectType.getDescribe();
        
        sObject prod = new Product2();
        prod.put('Name',ProductName);
        
        if(describeSObjectResult.fields.getMap().containsKey('CanUseRevenueSchedule')){
            prod.put('CanUseRevenueSchedule', canUserRevenueSchedule);   
        }
        if(describeSObjectResult.fields.getMap().containsKey('CanUseQuantitySchedule')){
            prod.put('CanUseRevenueSchedule', canUserRevenueSchedule);    
        }
        
        prod.put('IsActive',True);
        
        if(insertFlag)
            insert prod;
        
        return (Product2)prod;
    }

    Public Static PricebookEntry setupPriceBookEntry(String productId, Decimal unitPrice, Boolean insertFlag){
        PricebookEntry pbe = new PricebookEntry();
        pbe.Product2Id = productID;
        pbe.IsActive = True;
        pbe.UnitPrice = unitPrice;
        pbe.Pricebook2Id = Test.getStandardPricebookId();
        pbe.UseStandardPrice=false;
        
        if(insertFlag)
            insert pbe;
        
        return pbe;
    }
    
    Public Static OpportunityLineItem setupOppLineItem(String pricebookEntryId, String oppId, Decimal unitPrice, Integer quantity, Boolean insertFlag){
    
        OpportunityLineItem opli = new OpportunityLineItem();
        opli.UnitPrice = unitPrice;
        opli.Quantity = quantity;
        opli.OpportunityId = oppId;
        opli.PricebookEntryId = pricebookEntryId;

        if(insertFlag)
            insert opli;
        
        return opli;
    }

}
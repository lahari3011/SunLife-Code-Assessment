public with sharing class AccountListController{
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id, Name, OwnerId , Phone, Website, Industry, AnnualRevenue FROM Account WHERE Industry = 'Financial Services' ORDER BY Name];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
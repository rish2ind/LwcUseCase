public with sharing class ShowRecords {
    @AuraEnabled(cacheable=true)
    public static Integer countAccount(){
        List<Account> accList = [Select Name from Account];
        return accList.size();
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(Integer offSet, String searchKey){
        map<string,Schema.SObjectField> get_F_name=Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap();
        System.debug('These are maps : ' + get_F_name);
        Set<String> fnames = get_F_name.keySet();
        System.debug('This is fname : ' + fnames);
        list<String> fields=new List<String>();
        for(String s:fnames)
        {
            fields.add(''+get_F_name.get(s));
        }
        System.debug('These are fields : ' + fields);
        String fn = String.join(fields, ', ');
        
        System.debug('These are fields : ' + fn);
        String searching = '%' + searchKey+'%';
        String query = 'Select ' + fn + ' from Account'+ ' WHERE Name LIKE :searching LIMIT 8 OFFSET :offSet';
        List<Account> accList = Database.query(query);
      /*  String searching = '%' + searchKey+'%';
        List<Account> accList = [SELECT Name, Site, Phone, NumberOfEmployees FROM Account WHERE Name LIKE :searching  LIMIT 8 OFFSET :offSet];
        */
        System.debug(' OFFSET : ' + offSet);
        System.debug('This is account list : ' + accList);
        return accList;
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getContacts(String name){
        Account accList = [Select Id, Name from Account where Name = :name];
        Id accId = accList.Id;
        List<Contact> conList = [Select Name from Contact where accountId = :accId];
        System.debug('These are contacts : ' + conList);
        return conList;
    }
    @AuraEnabled(cacheable=true)
    public static Map<String, String> showFields(){
        map<string,Schema.SObjectField> get_F_name=Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap();
        System.debug('These are maps : ' + get_F_name);
      Set<String> fnames = get_F_name.keySet();
        System.debug('This is fname : ' + fnames);
      list<String> fields=new List<String>();
        for(String s:fnames)
        {
            fields.add(''+get_F_name.get(s));
        }
        System.debug('These are fields : ' + fields);
        List<String> labelName = new List<String>();
        Map<String, String> mapOfFields = new Map<String, String>();
        for(integer i = 0; i< fields.size(); i++){
            mapOfFields.put(fields[i], get_F_name.get(fields[i]).getDescribe().getLabel());
           // labelName.add(get_F_name.get(fields[i]).getDescribe().getLabel());
        }
        
      //  mapOfFields.put(labelName, fields); 
        System.debug('This is the final Map : ' + mapOfFields);
        System.debug('This is the label name : ' + labelName);
       return mapOfFields;  
    }
}

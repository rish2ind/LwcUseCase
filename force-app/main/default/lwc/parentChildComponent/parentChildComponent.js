import { LightningElement, track, wire } from 'lwc';
import getRecords from '@salesforce/apex/ShowRecords.getRecords';
import getContacts from '@salesforce/apex/ShowRecords.getContacts';
import countAccount from '@salesforce/apex/ShowRecords.countAccount';
import showFields from '@salesforce/apex/ShowRecords.showFields';
// const columns = [
//     { label: 'Name', fieldName: 'Name' },
//     { label: 'Site', fieldName: 'Site' },
//     { label: 'Phone', fieldName: 'Phone' },
//     { label: 'NumberOfEmployees', fieldName: 'NumberOfEmployees' },
   
// ];
export default class ParentChildComponent extends LightningElement {
    options;
    values;
    @track datas;
    @track data;
    @track contactList ;
    tempColumns = [];
    columns = [{label:'Id', fieldName: 'Id'},
                {label:'Name', fieldName: 'Name'},
            ];
    @track totalRecords;
    currentPage = 1;
    totalPage;
    limit = 8;
    @track enteredText = '';
   @track newOffSet = 0;
    mapOfFields = new Map();

    @wire(getRecords, {
        offSet : '$newOffSet',
        searchKey : '$enteredText'
    })
    wiredAccounts({error, data}){
        if(data){
            this.data = data;
            for(var i in this.data){
                console.log('This is total Data coming :' + this.data[i].Id);
            }
            
        } 
    }

    @wire(countAccount)
    wiredTotal({error, data}){
        if(data){
            this.totalRecords = data;
            this.totalPage = Math.ceil(this.totalRecords / 8);
        }
    }
    handleRowAction(event){
      //  alert('Yes it works');
        let actionName = event.detail.selectedRows;
        let recordName;
        console.log('Length : ' + actionName.length);
        for(let i = 0; i < actionName.length; i++){
            
            recordName = actionName[i].Name;
        }        
        getContacts({name : recordName})
        .then(result => {
            this.contactList = result;
        });
        // let row = event.detail.row;
        // console.log('This is row : ' + row);
    }
    handleNext(){
        if(this.currentPage < this.totalPage && this.currentPage > 0){
            this.currentPage = this.currentPage+1;
        }
        this.newOffSet = this.limit + this.newOffSet;  
        console.log('This is total pages : ' + this.totalPage);
        console.log('This is limit : ' + this.limit);
        console.log('This is offset : '+this.newOffSet)
        console.log('This is current Page : ' + this.currentPage);
        getRecords({
            offSet : this.newOffSet,
            searchKey : this.enteredText
        })
        .then(result => {
            this.data = result;
            console.log('This is data : ' + result);
        })
        
        if(this.currentPage > 1){
            this.template.querySelector('.previous').disabled = false;
            console.log('Isme aa rha h ?');
        }
        if(this.currentPage == this.totalPage){
            this.template.querySelector('.next').disabled = true;
        }
    }
    handlePrevious(){
       
            if(this.currentPage == 2){
                this.template.querySelector('.previous').disabled = true;
                console.log('Isme aa rha h ?');
            }   
        
        
            this.template.querySelector('.next').disabled = false;
        
        if(this.currentPage > 1){
            this.currentPage = this.currentPage -1;
        }
        this.newOffSet =  this.newOffSet - this.limit ;  
        console.log('This is total pages : ' + this.totalPage);
        console.log('This is limit : ' + this.limit);
        console.log('This is offset : '+this.newOffSet)
        console.log('This is current Page : ' + this.currentPage);
        getRecords({
            offSet : this.newOffSet,
            searchKey : this.enteredText
        })
        .then(result => {
            this.data = result;
            console.log('This is data : ' + result);
        })
       
    }
    handleKeyUp(event){
        this.enteredText = event.target.value;
        console.log('This is your text : ' + this.enteredText);
        this.currentPage = 1;

        getRecords({
            offSet : 0,
            searchKey : this.enteredText
        })
        .then(result => {
            this.data = result;
            console.log('This is fileterd data : ' + this.data);
        })

    }
    @wire(showFields)
    wiredFields({error, data}){
        if(data){
            this.mapOfFields = data;
            console.log('These are incoming fields : ' + this.mapOfFields);
            var opts=[];
            for(var i in this.mapOfFields){
                var op = {
                    label : this.mapOfFields[i], value : i
                }
                opts.push(op);
            }
            this.values = ['Id', 'Name'];
            this.options = opts;
            console.log('These are selected fields : ' + this.options);
        }
    }
    handleFields(event){
        this.tempColumns = [];
        var selected = event.target.value;
        console.log('This is selected option : ' + event.target.value);
        for(var i = 0; i< selected.length; i++){
            this.tempColumns.push({label: selected[i], fieldName : selected[i], type : 'String'}); 
        }
        
        this.columns = this.tempColumns;
     //   this.columns = event.target.value;
    //    this.datas = this.data;
        console.log('This is actual Data : ' + this.datas);
        console.log('This is normal data : ' + this.data);
    }
    
}
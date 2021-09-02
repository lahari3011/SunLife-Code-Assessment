import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountListController.getAccounts';
import { NavigationMixin } from 'lightning/navigation';
 
const columns = [
    { label: 'Account Name', fieldName: 'Name', type:'button', 
        typeAttributes: {
            label: { fieldName: 'Name' },
        name: 'Name'
    }, sortable: 'true'},
    { label: 'Account Owner', fieldName: 'OwnerId', type:'lookup', sortable: 'true' },
    { label: 'Phone', fieldName: 'Phone', type:'phone' },
    { label: 'Website', fieldName: 'Website', type:'url' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type:'currency' },
];

export default class AccountListDemo extends NavigationMixin(LightningElement) {
    // reactive variable
    @track data;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;
    @track errorMsg = '';
    strSearchAccName = '';

    // retrieving the data using wire service
    @wire(getAccounts)
    accounts(result) {
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }


    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;

    }

    handleAccountName(event) {
        this.strSearchAccName = event.detail.value;
    }

    handleSearch() {
        if(!this.strSearchAccName) {
            this.errorMsg = 'Please enter account name to search.';
            this.data = undefined;
            return;
        }

        getAccounts({strAccName : this.strSearchAccName})
        .then(result => {
            result.forEach((record) => {
                record.AccName = '/' + record.Id;
            });

            this.data = result;
            
        })
        .catch(error => {
            this.data = undefined;
            window.console.log('error =====> '+JSON.stringify(error));
            if(error) {
                this.errorMsg = error.body.message;
            }
        })  
    }
    /*navigateToAccountPage(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.value,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    } */ 
}
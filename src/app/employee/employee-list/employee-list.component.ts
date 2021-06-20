import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IAutoSuggestion, IEmployee } from '../employee.interface';
import { EmployeeService } from '../employee.service';
import {ConfirmationService, MessageService,
  PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class EmployeeListComponent implements OnInit {

  selectedempName: any;
  selectedempAddress: any;
  selectedempCompany: any;

  delselectedempName: any;
  delselectedempAddress: any;
  delselectedempCompany: any;

  

  autoSuggesstions:IAutoSuggestion={
    'name':[],
    'address':[],
    'company':[]
  };

  public empList:IEmployee[]=[];
  filteredEmpNames: any[];
  filteredEmpAddress: any[];
  filteredEmpCompany: any[];


  public deletedempList:IEmployee[]=[];
  delfilteredEmpNames: any[];
  delfilteredEmpAddress: any[];
  delfilteredEmpCompany: any[];


  filterSelectObj:any[] = [];
  
  display: boolean = false;

  selectedState: any = null;

    states: any[] = [
        {name: 'Arizona', code: 'Arizona'},
        {name: 'California', value: 'California'},
        {name: 'Florida', code: 'Florida'},
        {name: 'Ohio', code: 'Ohio'},
        {name: 'Washington', code: 'Washington'}
    ];
  
  
  constructor(
    private readonly employeeService:EmployeeService,
    private readonly confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {

    this.filterSelectObj = [
      {
        name: 'NAME',
        columnProp: 'name',
      }
      , {
         name: 'ADDRESS',
         columnProp: 'address',
      
       }, {
         name: 'COMPANY',
         columnProp: 'company',
       }
    ];
  

  }
 


  
  ngOnInit(): void {


    this.primengConfig.ripple = true;
    this.employeeService.getEmployeeList()
    .subscribe((data: IEmployee[]) => {
      this.empList = data;
      this.filterSelectObj.filter((o) => {
        //console.log(this.autoSuggesstions)
        this.autoSuggesstions[o.columnProp]=this.getFilterObject(this.empList, o.columnProp);
      });

      console.log(this.autoSuggesstions)
    })
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj:any[], key:string) {
    const uniqChk:any[] = [];
    console.log(key)
    fullObj.filter((obj:any) => {
      if (!uniqChk.includes(obj[key])) {
        if(key=='address'){
          let address=`${obj[key].street},${obj[key].suite},${obj[key].city},${obj[key].zipcode}`;
          uniqChk.push(address);

        }else if(key=='company') {
            uniqChk.push(obj[key].name);
        }
        else{
        uniqChk.push(obj[key]);
        }
      }
      return obj;
    });
    return uniqChk;
  }
  
  
  filterEmployee(event,type) {

    //console.log('event',this.autoSuggesstions.name);

    
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.autoSuggesstions[type].length; i++) {
      let empName = this.autoSuggesstions[type][i];
      if (empName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(empName);
      }
    }
    if(type==='address'){
      this.filteredEmpAddress=(filtered.length > 0)?filtered:['No results'];
    }else if(type==='company'){
      this.filteredEmpCompany=(filtered.length > 0)?filtered:['No results'];
    }else{
      this.filteredEmpNames=(filtered.length > 0)?filtered:['No results'];
    }
   
    //console.log('filteredEmpNames',this.filteredEmpNames);

  }


  delfilterEmployee(event,type) {

    //console.log('event',this.autoSuggesstions.name);

    
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.autoSuggesstions[type].length; i++) {
      let empName = this.autoSuggesstions[type][i];
      if (empName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(empName);
      }
    }
    if(type==='address'){
      this.delfilteredEmpAddress=(filtered.length > 0)?filtered:['No results'];
    }else if(type==='company'){
      this.delfilteredEmpCompany=(filtered.length > 0)?filtered:['No results'];
    }else{
      this.delfilteredEmpNames=(filtered.length > 0)?filtered:['No results'];
    }
   
    //console.log('filteredEmpNames',this.filteredEmpNames);

  }


  

  resetAll(dt){
    dt.reset();
    this.selectedempName='';
    this.selectedempAddress='';
    this.selectedempCompany='';

  }

  confirm(event: Event,data) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //confirm action
            console.log(data);
            this.deletedempList.push(data);
            const index = this.empList.findIndex(a => a.id === data.id) 
            
            console.log(index);
            if (index > -1) {
              this.empList.splice(index, 1);
            }

            this.messageService.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Record deleted successfully"
            });

        },
        reject: () => {
            //reject action
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "You have rejected Operation"
            });
        }
    });
}

restored(data){

  this.empList.push(data);
  const index = this.deletedempList.findIndex(a => a.id === data.id);
  console.log(index,data);

  if (index > -1) {
    this.deletedempList.splice(index, 1);
  }

  this.messageService.add({
    severity: "info",
    summary: "Confirmed",
    detail: "Record restored successfully"
  });

}



    showDialog() {
        this.display = true;
    }

}



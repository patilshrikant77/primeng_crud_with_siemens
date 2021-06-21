import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  actionTaken:String='add';
  selectedEmpforedit:IEmployee;

  selectedempName: any;
  selectedempAddress: any;
  selectedempCompany: any;

  delselectedempName: any;
  delselectedempAddress: any;
  delselectedempCompany: any;
  sortlatlngorder=false;

  

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

    
  
    empform: FormGroup;
  
  constructor(
    private readonly employeeService:EmployeeService,
    private readonly confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder) {

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

    this.empform = this.fb.group({
      firstname: [],
      lastname: [],
      city: [],
      suite: [],
      address: [],
      phone: [],
      company: [],
      website: [],
      email:[],
      zip:[]
    });


    this.primengConfig.ripple = true;
    this.employeeService.getEmployeeList()
    .subscribe((data: IEmployee[]) => {
      this.empList = data;

      /*----sorting array with lon and lat  to calculate distance first----*/
     
   this.empList.forEach(e=>{
      e.address["distance"] = this.calculateDistance(this.empList[0].address.geo.lat,this.empList[0].address.geo.lng,e.address.geo.lat,e.address.geo.lng,"K");
    })

    this.empList.sort(function(a, b) { 
      return a.address['distance'] - b.address['distance'];
    });
        
      /*------end----------*/

      this.filterSelectObj.filter((o) => {
        //console.log(this.autoSuggesstions)
        this.autoSuggesstions[o.columnProp]=this.getFilterObject(this.empList, o.columnProp);
      });

      console.log(this.autoSuggesstions)
    })
  }

 calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
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
      console.log('Action',this.actionTaken)
         if(this.actionTaken==='add'){
          this.empform.reset();
         }
        this.display = true;
    }
   submit(){
     const employee=this.selectedEmpforedit;
     let actionMsg="Employee added successfully";
     const newEmp={
      id:0,
      username:'',
      name: `${this.empform.value.firstname+' '+this.empform.value.lastname}`,
      email:this.empform.value.email,
      address: {
        street:this.empform.value.address,
        suite:this.empform.value.suite,
        city:this.empform.value.city,
        zipcode:this.empform.value.zip,
        geo: {
          lat:(this.actionTaken==='add')?0:employee.address.geo.lat,
          lng:(this.actionTaken==='add')?0:employee.address.geo.lng
         }

      },
      phone:this.empform.value.phone,
      website:this.empform.value.website,
      company:{
        name:this.empform.value.company,
        catchPhrase:(this.actionTaken==='add')?'NA':employee.company.catchPhrase,
        bs:(this.actionTaken==='add')?'NA':employee.company.bs
      }
    }

    console.log(newEmp);

   

   
    //this.empList.push(newEmp);
    if(this.actionTaken==='add'){
      const id=Math.max(...this.empList.map(emp => emp.id))+1; //get max id form array object
      newEmp.id=id;
      newEmp.address.geo.lat=this.getRandomInRange(-180, 180, 3);
      newEmp.address.geo.lat=this.getRandomInRange(-210, 190, 3);
      newEmp.username=this.empform.value.firstname+id,
  
       this.empList= [...this.empList, newEmp];
    }else{
      newEmp.id=employee.id;
      const index = this.empList.findIndex(a => a.id === employee.id) 
      this.empList[index]=newEmp;
      actionMsg="employee updated successfully";

    }

    this.messageService.add({
      severity: "info",
      summary: "Confirmed",
      detail: actionMsg
    });
    this.display = false;

    console.log('complete',this.empList);

    }

     getRandomInRange(from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
      // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

    editEmployee(event: Event,employee){
      this.empform.reset(this.empform.value);
      this.selectedEmpforedit=employee;

      this.empform.controls['email'].setValue(employee.email);
      this.empform.controls['phone'].setValue(employee.phone);
      this.empform.controls['address'].setValue(employee.address.street);
      this.empform.controls['city'].setValue(employee.address.city);
      this.empform.controls['suite'].setValue(employee.address.suite);
      this.empform.controls['website'].setValue(employee.website);
      this.empform.controls['zip'].setValue(employee.address.zipcode);
      this.empform.controls['company'].setValue(employee.company.name);
      const name=employee.name.split(' ');
      this.empform.controls['firstname'].setValue(name[0]);
      this.empform.controls['lastname'].setValue(name[1]);
      this.actionTaken='edit';
      this.showDialog();
     // this.empform.value.email=employee.email;
    }

    closeDialog(){
      this.display = false;
      this.actionTaken='add';
    }

    sortRecord(event){
      
       this.sortlatlngorder=!this.sortlatlngorder;
      this.empList.sort((a, b)=> { 
       if(this.sortlatlngorder){
        return b.address['distance'] - a.address['distance'];
       }else{
        return a.address['distance'] - b.address['distance'];
       }
      });
    

      

      //console.log( this.empList, this.sortlatlngorder)
      //data.sort

    }
    

}



import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IEmployee } from '../employee.interface';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  public empList:IEmployee[]=[];
  constructor(private readonly employeeService:EmployeeService) {

  }
 


  
  ngOnInit(): void {
    this.employeeService.getEmployeeList()
    .subscribe((data: IEmployee[]) => {
      this.empList = data;
    })
  }
  

  }






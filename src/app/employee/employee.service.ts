import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee } from './employee.interface';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl="https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) { }

  getEmployeeList(){
   // console.log(this.apiUrl);
    return this.http.get<IEmployee[]>(this.apiUrl);

  }

  getCountries() {
    return this.http.get<any>('assets/countries.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
    }

    getlonlat(zipCode){
      return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode + '&key=AIzaSyDR1884SVbhC4qtu1VVO4Lg0oZMzmOejrU');
    }
}



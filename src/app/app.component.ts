import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(public customerservice: CustomerService){}
  


}




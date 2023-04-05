import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DashboardService } from 'src/app/services/dashboard.service';

declare var window: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  responseMessage: any;
  data: any;

  constructor(private dashboard: DashboardService) {}
  public ngOnInit(): void {
    this.dashboard.getDetails().subscribe((response: any) => {
      this.data = response;
    });
  }
}

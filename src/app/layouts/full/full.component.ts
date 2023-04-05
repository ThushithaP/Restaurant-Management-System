import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from 'src/app/layouts/full/dashboard/dashboard.component';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css'],
})
export class FullComponent {
  get(): string {
    return '';
  }
}

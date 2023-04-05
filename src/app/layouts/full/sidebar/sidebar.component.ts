import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { sidebarData } from './sideData';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  sideData = sidebarData;
}

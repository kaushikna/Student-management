import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: any = {};
  data;
  constructor(private dashboardService: DashboardService, public authService: AuthService) {
    this.currentUser = this.authService.getUser();

  }
  ngOnInit() {
    this.dashboardService.getDashboardFilterData().subscribe(response => {
      this.data = {};
      Object.assign(this.data, response);
    });
  }

}

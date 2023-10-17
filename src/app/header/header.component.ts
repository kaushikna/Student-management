import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  public get currentUser(): any {
    const currentUser: any = this.authService.getUser();
    currentUser.image = currentUser.avatar || "/assets/images/profile.svg";
    return currentUser;
  }
  imageData: any = {};
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
  }

  onLogin() {
    this.authService.logout();
  }
  onLogout() {
    this.authService.logout();
  }

}

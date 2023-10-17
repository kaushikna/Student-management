import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/Models';
import { AuthService } from 'src/app/services/auth.service';
import { Menu, MENUS } from 'src/app/_shared/interfaces/constatnts/menu';


@Component({
  selector: 'app-dashboard-left-nav',
  templateUrl: './dashboard-left-nav.component.html',
  styleUrls: ['./dashboard-left-nav.component.css']
})
export class LayoutComponent {

  menus: Menu[] = MENUS;
  main: any
  flag: boolean = true;
  textlass:any

  constructor(private router: Router, private authService: AuthService) {
    const currentUser: any = this.authService.getUser();
    const { studentAccountType, role: userRole } = currentUser;
    const activeCustomer = userRole === Role.STUDENT && studentAccountType !== "active";

    this.menus = this.menus.filter((menu: Menu) => {
      return menu.enabled && menu.roles.find((role: string) => role === currentUser.role);
    });

    if (activeCustomer) {
      const activeMenus = ["Events", "Test Papers", "Test Results", "Resource Library"];
      this.menus = this.menus.filter((menu: Menu) => {
        return !activeMenus.find((activeMenu: string) => activeMenu === menu.title);
      });
    }

  }

  onMenuClick(menu: Menu) {
    console.log("menuuu", menu);
    this.main = menu.title
    this.textlass = 'mclass';
    if (menu.enabled) {
      this.router.navigate([menu.path]);
    }

  }
  onLogout() {
    this.authService.logout();
  }
}

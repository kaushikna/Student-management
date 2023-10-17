import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
    constructor(private authService: AuthService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.queryParamMap.subscribe((params: any) => {
            this.authService.verify(params.params).subscribe(() => {
                this.toastr.success("Your password has been sent to your email", 'Success', {
                    timeOut: 3000
                });
                this.router.navigate(['/login']);
            });
        });
    }

}

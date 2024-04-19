import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { forkJoin, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  adminBtn: boolean = false;
  constructor(private authService: AuthService, private router: Router){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const email = this.authService.getToken()['email'];

    forkJoin([
      this.authService.isAdmin(email),
      this.authService.isSuperAdmin(email)
    ]).pipe(
      tap(([isAdmin, isSuperAdmin]) => {
        this.adminBtn = isAdmin || isSuperAdmin;
      })
    ).subscribe();
  }

  adminPanel(){
    this.router.navigate(['/admin']);
  }
}

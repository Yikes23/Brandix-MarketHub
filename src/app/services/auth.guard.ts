import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(public auth: AuthService, public router: Router) {}
  
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable()
export class AdminAuthGuard {
  
  email = this.auth.getToken()
  constructor(private auth: AuthService, private router: Router) {
    this.email = this.email ? this.email['email'] : null;
  }
  
  async canActivate() {
    if(this.email){
      this.auth.isAdmin(this.email)
      const isAdmin = await this.auth.isAdmin(this.email)
      .pipe(map((data: any) => data as any)).toPromise()
  
      if(this.auth.isAuthenticated()) {
        if(isAdmin){
          return true;
        }
        this.router.navigate(['/home']);
        return false;
      }
      else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    return false;
  }
    
}
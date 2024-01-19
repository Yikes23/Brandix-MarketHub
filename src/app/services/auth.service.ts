import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://bel-fr-rdp:3020/api/auth';  // Update to point to your Nginx reverse proxy
  jwtHelper = new JwtHelperService();
  private isAdminSubject = new Subject<boolean>();

  constructor(private http: HttpClient) { }
  
  signIn(email: string | null, password: string | null): Observable<any> {
    console.log(email, password);
    const signInDto = {
      email: email,
      password: password,
    };
  
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      signInDto,
      options
    );
  }
  

  isAdmin(email: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/isAdmin/${email}`)
  }
  
  setToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(): any {
    return this.jwtHelper.decodeToken(String(localStorage.getItem('token')));
  }

  getEncodedToken(): string {
    return String(localStorage.getItem('token'));
  }

  isAuthenticated(){
    const token = this.getEncodedToken();
    if(token === 'null'){
      return false;
    }
    else {
      if(this.jwtHelper.isTokenExpired(token)){
        localStorage.removeItem('token');
        localStorage.removeItem('disclaimer')
        return false
      }
    }
    return token !== 'null' ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  setDisclaimer(){
    localStorage.setItem('disclaimer', '1');
  }

  getDisclaimer(){
    return localStorage.getItem('disclaimer') ? false: true;
  }

}



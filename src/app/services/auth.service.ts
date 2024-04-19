import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  apiUrl = API_URL +'auth';  // Update to point to your Nginx reverse proxy
  jwtHelper = new JwtHelperService();
  private isAdminSubject = new Subject<boolean>();

  constructor(private http: HttpClient) { }
  
  signIn(email: string | null, password: string | null): Observable<any> {
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

  isSuperAdmin(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/isSuperAdmin/${email}`)
  }
  
  setToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(): any {
    if(localStorage.length > 0){
      return this.jwtHelper.decodeToken(String(localStorage.getItem('token')));
    }
    return null;  
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
        this.clearLocalStorage();
        return false
      }
    }
    return token !== 'null' ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('disclaimer');
  }

  setDisclaimer(){
    localStorage.setItem('disclaimer', '1');
  }

  getDisclaimer(){
    return localStorage.getItem('disclaimer') ? false: true;
  }

  updateAdmin(email: string, flag: boolean){
    return this.http.patch(`${this.apiUrl}/updateAdmin/${email}/${flag}`, {});
  }

  getAdmins(){
    return this.http.get(`${this.apiUrl}/admins`);
  }
}



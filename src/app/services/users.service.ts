import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURL = 'http://bel-fr-rdp:3020/api/user';
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getWishlistStatus(postId: string): Observable<boolean>{
    const userId = this.authService.getToken()['id']; 
    return this.http.get<boolean>(`${this.apiURL}/wishlist/${String(userId)}/${String(postId)}`)
  }

  getPosts(userId: string): any{
    try{
      return this.http.get(`${this.apiURL}/posted/${userId}`);
    }
    catch(error){
      return error;
    }
  }

  updateWishlist(postId: string, wishlist: boolean){
    console.log(postId, wishlist)
    const userId = this.authService.getToken(); 
    const body = { userId: String(userId.id), postId : String(postId), wishlist: wishlist };
    return this.http.patch(`${this.apiURL}/wishlist`, body).subscribe(data => console.log(data));
  }
}

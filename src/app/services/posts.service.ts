import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  apiURL = 'http://bel-fr-rdp:3020/api/posts';
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient, private auth: AuthService) { }

  createPost(data: any) {
    const jsonbody = JSON.stringify(data);
    console.log(jsonbody)
    this.http.post(`${this.apiURL}/create`, data).subscribe(data => {
      console.log(data)
    })
  }

  findPost(id: string){
    return this.http.get(`${this.apiURL}/findPost/${id}`);
  }

  viewImages(id: number){
    return this.http.get(`${this.apiURL}/images/${id}`);
  }

  adminGetPost(){
    return this.http.post(`${this.apiURL}/post/1`, {})
  }
 
  userGetPost(pageLimit: number, pageIndex: number, filter?: any){
    const body = { filter: filter }
    const url = `${this.apiURL}/post/0?pageLimit=${pageLimit}&pageIndex=${pageIndex}`;
    return this.http.post(url, body);
  }

  approvePost(id: number, approve: boolean, comments?: string){
    console.log(comments)
    return this.http.delete(`${this.apiURL}/adminPost/${id}/${approve}`,
    {params: { comments: comments || '' }} 
    )
  } 

  getSuggestions(query: string | null) {  
    const suggestions = this.http.get(`${this.apiURL}/autocomplete?search=${query}`);
    return suggestions
  }  
      
  createReview(ratings: number, comments: string, postId: number) {
    const user = (this.jwtHelper.decodeToken(this.auth.getToken()))['name'];
  
    const requestBody = {
      reviewedBy: user,
      ratings,
      comment: comments,
    };
  
    this.http.post(`${this.apiURL}/post/${postId}`, requestBody)
      .subscribe(data => console.log(data));
  }
  

  deletePost(id: number | string){
    return this.http.delete(`${this.apiURL}/userPost/${id}`);
  }
}



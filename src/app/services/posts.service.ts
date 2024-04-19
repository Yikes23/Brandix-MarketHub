import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { API_URL } from 'src/constant';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  apiURL = API_URL + 'posts';
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient, private auth: AuthService) { }

  createPost(data: any) {
    // const jsonbody = JSON.stringify(data);
    // console.log(jsonbody)

    const formData = new FormData();

    // Append all fields except 'images'
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });
  
    const images = data['images'] as File[]; // Assuming 'images' is an array of File objects
    // Append 'images' as an array of File objects
    if (images && Array.isArray(images)) {
      images.forEach((file: File) => {  
        formData.append('images', file, file.name);
      });
    }

    console.log(formData.getAll('images'))
    // const header = new HttpHeaders({'Content-Type': 'multipart/form-data'})

    this.http.post(`${this.apiURL}/create`, formData).subscribe(data => {
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
  
  activatePost(postId: number) {
    return this.http.patch(`${this.apiURL}/activate/${postId}`, {});
  }

  deletePost(id: number | string){
    return this.http.delete(`${this.apiURL}/userPost/${id}`);
  }
}



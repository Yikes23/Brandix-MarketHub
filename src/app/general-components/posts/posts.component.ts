import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {

  constructor(private router: Router){}
  @Input() posts: any[] = [];


  viewPost(post: any){
    this.router.navigate(['/viewPost', post.id]);
  }

  postedOn(date: string){
    const localDate = new Date(date);
    return `${localDate.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour:'2-digit',
      minute:'numeric',
      hour12: true,
    })}`
  }

  getPrice(price: string){

    const numbericPrice = parseFloat(price);

    if(!isNaN(numbericPrice)){
      return numbericPrice.toLocaleString('en-US');
    }
    else{
      return 'Unavailable'
    }
  }

  postLength(): number{
    return _.keys(this.posts).length;
  }
}

import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ImageService } from 'src/utility/displayImage';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {

  @Input() posts: any[] = [];
  showSkeleton: boolean = true;

  constructor(private router: Router,
              private imageService: ImageService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && changes['posts'].currentValue) {
      // Handle changes to the 'posts' input
      this.showSkeleton = true; // Show skeleton when new posts are received
        setTimeout(() => {
          this.showSkeleton = false;
        }, 2000);
      }
  }

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

  getImageLength(image: any){
    
    if(image){
      return this.imageService.displayImage(image.data)
    }
    return 0

  }

  postLength(): number{
    return _.keys(this.posts).length;
  }
}

import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import * as _ from 'lodash';
import { ImageService } from 'src/utility/displayImage';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
  providers: [NgbCarouselConfig]
})
export class ViewPostComponent {

  isBookmarked: boolean  = false;
  isAdmin: boolean = false;
  conditions: boolean = false;
  selectedPost: any;
  skeleton: boolean = true;
  images: any;
  reviews: any[] = [];
  
  constructor(config: NgbCarouselConfig, 
      public dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      private _snackBar: MatSnackBar,
      private postService: PostsService,
      private userService: UsersService,
      private imageService: ImageService,
      private authService: AuthService) {
    // customize default values of carousels used by this component tree
    this.conditions = this.authService.getDisclaimer();
		config.interval = 4000;
		config.wrap = true;
		config.keyboard = false;
    config.pauseOnHover = false;
	}
  
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.forEach(params => {
      const postId = params['id'];
      
      this.postService.findPost(postId).subscribe((data: any) => {
        if(!data.expired || this.isAuthor(data.postedBy)){
          this.selectedPost = data;
          this.images = this.base64Convert(this.selectedPost.images);
          this.userService
          .getWishlistStatus(this.selectedPost?.id)
          .subscribe((data: boolean) => {
            this.isBookmarked = data;
          }) 
        }

        setTimeout(() => {
          this.skeleton = false;
        }, 2000);
        
        // _.forEach(this.selectedPost.reviews, 
        //   (data: any) => {
        //     this.reviews.push(JSON.parse(data))
        //   }
        // )
      });
    })
    
    const author = this.authService.getToken()['email'];
    this.authService.isAdmin(String(author).toLowerCase()).subscribe(response =>{
      this.isAdmin = response;
    });
  }

  base64Convert(images: Array<any>){
    const image64: any = []
    images.forEach((image) => {
      image64.push(this.imageService.displayImage(image.data.data))
    })
    return image64;
  }

  getPrice(){
    const numbericPrice = parseFloat(this.selectedPost?.price);

    if(!isNaN(numbericPrice)){
      return numbericPrice.toLocaleString('en-US');
    }
    else{
      return 'Unavailable'
    }
  }

  postedOn(date: string){
    const localDate = new Date(date);
    return `${localDate.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      hour:'2-digit',
      minute:'numeric',
      hour12: true,
    })}`
  }
  
  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
    
    this.userService.updateWishlist(this.selectedPost.id, this.isBookmarked)
    this._snackBar.open(
      this.isBookmarked ? 'Successfully added to wishlist': 
      'Removed from wishlist', 'Close',
      {
        duration: 3000,
        politeness: 'assertive',
      }
      )
    }
    
    navigateTo(location: string, data: string) {
      this.router.navigate([`/${location}`], {state: {data: data}});
    }
    
    isAuthor(postedBy? : String): boolean {
      const author = this.authService.getToken()['email'];

      if(this.isAdmin || author === this.selectedPost?.postedBy || author === postedBy){
        return true
      }
      return false;   
    }

    activatePost(){
      this.postService.activatePost(this.selectedPost.id).subscribe(response => {
        this.selectedPost.expired = false;
      });
    }
    
    deletePost(){
      this.dialog.open(DeletePostComponent).afterClosed().subscribe((valid: any) => {
        if(valid){
          this.router.navigate([`/home`])
          this.postService.deletePost(this.selectedPost.id).subscribe()
        }
      })
    }
}

// @Component({
//   selector: 'app-create-review',
//   templateUrl: './review-post.component.html',
//   styleUrls: ['./view-post.component.css'],
// })
// export class ReviewPostComponent {

//   rating: number = 0; 
//   comments: string = '';  
//   constructor(public dialogRef: MatDialogRef<ReviewPostComponent>){}

//   active(): boolean{
//     if(this.rating && this.comments !== ''){
//       return true
//     }
//     return false;
//   }

//   exit(){
//     this.dialogRef.close()
//   }
//   submit(){
//     this.dialogRef.close([this.rating + 1, this.comments]);
//   }

// }

@Component({
  selector: 'app-view-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./view-post.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  standalone: true,
})
export class DeletePostComponent {
  constructor(public dialogRef: MatDialogRef<DeletePostComponent>){}
  close(action: boolean){
    this.dialogRef.close(action);
  }
}
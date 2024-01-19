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

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
  providers: [NgbCarouselConfig]
})
export class ViewPostComponent {

  isBookmarked: boolean  = false;
  selectedPost: any;
  images: any;
  reviews: any[] = [];
  
  constructor(config: NgbCarouselConfig, 
      public dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      private _snackBar: MatSnackBar,
      private postService: PostsService,
      private userService: UsersService,
      private authService: AuthService) {
    // customize default values of carousels used by this component tree
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

      this.postService.findPost(postId).subscribe(data => {
        this.selectedPost = data;
        console.log(data)
        this.images = this.selectedPost.images;
        this.userService
        .getWishlistStatus(this.selectedPost?.id)
        .subscribe((data: boolean) => {
          this.isBookmarked = data;
        }) 
        
        _.forEach(this.selectedPost.reviews, 
          (data: any) => {
            this.reviews.push(JSON.parse(data))
          }
        )
      });
    })
    
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
      console.log(data)
      this.router.navigate([`/${location}`], {state: {data: data}});
    }
    
    isAuthor(): boolean{
      const author = this.authService.getToken()['email']
      return author === this.selectedPost?.postedBy ? true : false;
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

@Component({
  selector: 'app-create-review',
  templateUrl: './review-post.component.html',
  styleUrls: ['./view-post.component.css'],
})
export class ReviewPostComponent {

  rating: number = 0; 
  comments: string = '';  
  constructor(public dialogRef: MatDialogRef<ReviewPostComponent>){}

  active(): boolean{
    if(this.rating && this.comments !== ''){
      return true
    }
    return false;
  }

  exit(){
    this.dialogRef.close()
  }
  submit(){
    this.dialogRef.close([this.rating + 1, this.comments]);
  }

}

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
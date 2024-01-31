import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import * as _ from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  posts: any = [];

  displayedColumns: string[] = ['Images', 'ID', 'Title', 'Description', 'Price', 'Negotiable', 'Categories', 'SubCategories', 'Location','Posted By', 'Posted On', 'Verify'];

  constructor(public dialog: MatDialog, private router: Router, private postService: PostsService){}

  ngOnInit(): void {
    this.postService.adminGetPost().subscribe((data: any) => {
      this.posts = data['data'];
      console.log(data)
    })
  }

  showImage(element: any){
    this.postService.viewImages(element.id).subscribe((imageUrl) => {
      const config: MatDialogConfig = {
        data: imageUrl 
      }
      this.dialog.open(adminImagePreviewer, config)
    })
  }

  approvals(element: any, approve: boolean){

    this.dialog.open(
      adminApproval,
      { data: approve }
      ).afterClosed().subscribe((valid: any) => {

      if(approve){
        console.log(valid['comments'])
        this.postService.approvePost(element.id, approve).subscribe();
      }
      else{
        this.postService.approvePost(element.id, approve, valid['comments']).subscribe();
      }
        this.posts = this.posts.filter((post: any) => post.id !== element.id)
      }
    )
  }

  navigateTo(route: string): void {
    // Use the Angular Router to navigate to the specified route
    this.router.navigate([route]);
  }

}


@Component({
  selector: 'admin-image-previewer',
  templateUrl: './admin-image-previewer.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    MatIconModule, 
    NgbCarouselModule, 
    CommonModule,
    MatCardModule,
    MatDialogModule
  ],
  standalone: true
})
export class adminImagePreviewer {

  images: any;
  constructor(public dialogRef: MatDialogRef<adminImagePreviewer>,
    @Inject(MAT_DIALOG_DATA) public data: any){
       this.images = data;
    }

  close(){
    this.dialogRef.close()
  }

}

@Component({
  selector: 'admin-approval',
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [ 
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  standalone: true
})
export class adminApproval{

  comments: string = '';
  constructor(
    public dialogRef: MatDialogRef<adminApproval>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  close(action: boolean){
    this.dialogRef.close({action: action, comments: this.comments});
  }

}
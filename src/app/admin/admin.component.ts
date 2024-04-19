import { CommonModule } from '@angular/common';
import { Component, Inject, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import * as _ from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../services/auth.service';
import { ImageService } from 'src/utility/displayImage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  posts: any = [];
  isSuperAdmin: boolean = false;
  displayedColumns: string[] = ['Images', 'ID', 'Title', 'Description', 'Price', 'Negotiable', 'Categories', 'SubCategories', 'Location','Posted By', 'Posted On', 'Verify'];

  constructor(public dialog: MatDialog, 
              private router: Router, 
              private postService: PostsService,
              private authService: AuthService,
              private imageService: ImageService
              ){}

  ngOnInit(): void {
    this.postService.adminGetPost().subscribe((data: any) => {
      this.posts = data['data'];  
      console.log(this.posts)
    })

    this.authService.isSuperAdmin(this.authService.getToken()['email'])
    .subscribe(response => {
      this.isSuperAdmin = response;
    }); 
  }

  base64Image(data: ArrayBuffer){
    return this.imageService.displayImage(data)
  }
  
  showImage(element: any){
    this.postService.viewImages(element.id).subscribe((imageUrl) => {
      const config: MatDialogConfig = {
        data: imageUrl 
      }
      this.dialog.open(adminImagePreviewer, config)
    })
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
  

  approvals(element: any, approve: boolean){
    this.dialog.open(
      adminApproval,
      { data: approve }
      ).afterClosed().subscribe((valid: any) => {
        if(approve && valid['action']){
          this.postService.approvePost(element.id, approve).subscribe();
          this.posts = this.posts.filter((post: any) => post.id !== element.id);
        }
        else if(valid['action']){
          this.postService.approvePost(element.id, approve, valid['comments']).subscribe();
          this.posts = this.posts.filter((post: any) => post.id !== element.id);
        }
      }
    )
  }

  updateAdmin(){
    this.dialog.open(MasterAdmin, {
      hasBackdrop: true,
      autoFocus: true,
      width: '50%',
    })
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
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data: any[]){
      const images: any[] = []
      console.log(data)
      data.forEach(image => {
        images.push(this.imageService.displayImage(image.data.data))
      })
      this.images = images;
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

@Component({
  selector: 'master-admin',
  templateUrl: './master-admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [ 
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,  
    MatChipsModule,
  ],
  standalone: true
})
export class MasterAdmin {
  
  form: FormGroup;
  emails: any;
  constructor(private fb: FormBuilder, private authService: AuthService){
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getAdmins().subscribe(admins =>{
      this.emails = admins
    })

  }

  removeEmail(email: string): void{
    this.authService.updateAdmin(email, false).subscribe(response => {
      response? 
      this.emails = this.emails.filter((value: any) => value !== email):
      ''
    })
  }
  
  adminExists(){
    const exist = this.emails?.includes(String(this.form.get('email')?.value).toLowerCase());
    return exist
  }
  
  submit(){
    if(!this.form.get('email')?.hasError('required') && !this.form.get('email')?.hasError('email')){
      if(!this.adminExists()){
        this.authService.updateAdmin(this.form.get('email')?.value, true).subscribe(response => {
          if(response){
            this.emails?.length ? 
            this.emails.push(String(this.form.get('email')?.value).toLowerCase()):
            this.emails = [String(this.form.get('email')?.value).toLowerCase()]
          }
          this.form.get('email')?.setValue('');  
        });
      }

    } 
  } 

}
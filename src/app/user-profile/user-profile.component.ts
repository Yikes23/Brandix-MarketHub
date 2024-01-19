import { Component} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletePostComponent } from '../view-post/view-post.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  animations: [
    trigger('collapseExpand', [
      state('collapsed', style({ height: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('400ms ease-out')),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1700ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),

  ]
})
export class UserProfileComponent {
  
  profile: any = {};
  postedAds: any;
  wishlist: any;
  posts = [];
  collapse = false;
  fadeIn = false;

  constructor(private authService: AuthService, 
              private userService: UsersService,
              private router: Router,
              public dialog: MatDialog){
    setTimeout(() => {
      this.collapse = true;
    }, 500);
  }
  
  ngOnInit(): void {
    const token = this.authService.getToken();
    this.userService.getPosts(token.id).subscribe((data: any) => {
      this.postedAds = data.posted
      this.wishlist = data.wishlist
    })
    this.profile.name = token.name
    this.profile.id = String(token.id).padStart(4, '0');
    this.profile.email = token.email; 
    this.profile.mobile = token.mobile || 'Unavailable';
    document.body.style.overflowX = 'hidden';
  }

  logout(){
    this.dialog.open(DeletePostComponent, {
      hasBackdrop: true
    }).afterClosed().subscribe((valid: any) => {
      if(valid){
        this.authService.clearLocalStorage()
        this.router.navigate([''])
      }
    })
  }
  
}

import { Component} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletePostComponent } from '../view-post/view-post.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('collapseExpand', [
      state('collapsed', style({ height: '0', width: '100vw' })),
      state('expanded', style({ height: '*', width: '100vw'})),
      transition('collapsed <=> expanded', animate('400ms ease-out')),
    ]),

  ]
})
export class UserProfileComponent {
  
  profile: any = {};
  postedAds: any = []; 
  wishlist: any = [];
  posts = [];
  collapse = false;
  fadeIn = false;
  conditions: boolean = false;

  token = this.authService.getToken();

  constructor(private authService: AuthService, 
              private userService: UsersService,
              private router: Router,
              public dialog: MatDialog)
              {
    this.conditions = this.authService.getDisclaimer(); 
    setTimeout(() => {
      this.collapse = true;
    }, 500);
    
    this.profile.name = this.token.name
    this.profile.id = String(this.token.id).padStart(4, '0');
    this.profile.email = this.token.email; 
    this.profile.mobile = this.token.mobile || 'Unavailable';
    document.body.style.overflowX = 'hidden';
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    try{
      this.userService.getPosts(this.token.id).subscribe((data: any) => {
        this.postedAds = data.posted
        this.wishlist = data.wishlist
      })
    }
    catch(error) {
      console.log(error)
    }
    
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

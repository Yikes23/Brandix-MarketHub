import { Component} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
        animate('1500ms ease-in-out', style({ opacity: 1 })),
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
              private domSanitizer: DomSanitizer){
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
  
}

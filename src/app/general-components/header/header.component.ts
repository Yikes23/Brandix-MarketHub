import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  hideToolbar = false;
  showRequirements: boolean = false;
  prevScrollY: number = 0;

  constructor(private router: Router) { }
  
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  @HostListener('window:scroll', [])
  onScroll(){

    if(window.scrollY - this.prevScrollY > 25){
      this.hideToolbar = true 
    }
    else if(window.scrollY - this.prevScrollY < -10){
      this.hideToolbar = false 
    }

    this.prevScrollY = window.scrollY;
  }

}
  
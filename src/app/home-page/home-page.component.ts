import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  conditions: boolean;
  constructor(private router: Router, private auth: AuthService) {
    this.conditions = this.auth.getDisclaimer();
  }

  objects: any[] = [
    {category: 'Electronics', icon: 'gadgets'},
    {category: 'Vehicles', icon: 'car'},
    {category: 'Home & Garden', icon: 'gardening'},
    {category: 'Sports & outdoors', icon: 'sports'},
    {category: 'Collectibles & Art', icon: 'paint-palette'},
    {category: 'Kids', icon: 'toys'},
    {category: 'Books & Media', icon: 'stack-of-books'},
    {category: 'Animals', icon: 'pets'},
    {category: 'Property', icon: 'office-building'},
    {category: 'Essentials', icon: 'diet'},
    {category: 'HR Services', icon: 'service'},
    {category: 'Others', icon: 'delivery-box'},
  ];

  selectedCategory(category: string){
    if(category){
      this.router.navigate(['/posts'], {state: {data: category}});
    }
    else{
      this.router.navigate(['/posts']);
    }
  }
  
}

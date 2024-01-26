import { Component } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Categories from 'src/utility/category';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PostsService } from '../services/posts.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css'],
  animations: [
    trigger('expandChips', [
      state('void', style({ height: '0', opacity: '0' })),
      state('*', style({ height: '*', opacity: '1' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class PostsPageComponent {

  categories: Task[] = [];
  conditions: boolean = false;
  selectedCity = new FormControl('');
  cityChips: String[] = [];
  cities = [  
    'Colombo',
    'Gampaha',
    'Kandy',
    'Kalutara',
    'Kurunegala',
    'Galle',
    'Ratnapura',
    'Anuradhapura',
    'Kegalle',
    'Matara',
    'Puttalam',
    'Jaffna',
    'Ampara',
    'Batticaloa',
    'Matale',
    'Badulla',
    'Hambantota',
    'Trincomalee',
    'Polonnaruwa',
    'Nuwara Eliya',
    'Monaragala',
    'Vavuniya',
    'Kilinochchi',
    'Mannar',
    'Mullativu',
  ].sort();
  posts: any;
  pageSize: number = 8;
  pageIndex: number = 0;

  constructor(
    public dialog: MatDialog,   
    private postService: PostsService,
    private authService: AuthService){
    this.categories = [];
    this.conditions = this.authService.getDisclaimer();

    Categories.forEach((element) => {
      if(element.mainCtg === history.state.data){
        this.filterCategory(element, true);
      } 
      else{
        this.filterCategory(element, false);
      }
    }) 
  }
  
  ngOnInit(): void {
    //Called after the constructor,   initializing input properties, and the first call to ngOnChanges.
    //Add 'implements On Init' to the class.
    this.retrievePost(this.pageIndex, this.pageSize)
  }
  
  retrievePost(page: number, limit: number){
    const filter = this.filterPost();
    this.postService.userGetPost(limit, page, filter).subscribe((postObj: any) =>{ 
      this.posts = postObj
    })  
  }

  filterPost(){
    const subCategories: string[] = []
    this.categories.map(category => {
      category.subtasks?.filter(subtask => subtask.completed ? subCategories.push(subtask.name) : '')
    })
    
    let filter: any = {};

    if(this.cityChips.length > 0){
      filter.location = [];
      this.cityChips.map(city => filter.location.push(city));
    }
    filter.subCtg = subCategories;

    return filter
  }


  filterCategory(element: any, filter: boolean){ 

    filter ? this.setAll(element.mainCtg) : '';
    this.categories.push({
      name: element.mainCtg,
      completed: filter, 
      color: 'primary',
      subtasks: element.subCtg.map((subCtg: string) => {
        if(filter){
          return {name: subCtg, completed: true, color: 'primary'}
        }
        else{
          if(subCtg === history.state.data){
            return {name: subCtg, completed: true, color: 'primary'}
          }
          return {name: subCtg, completed: false, color: 'primary'}
        }
      }),
    })

  }

  filterLocation(){
    return this.cities.filter(city => city.toLowerCase().includes(String(this.selectedCity.value).toLowerCase()));
  }

  clearInput(){
    this.selectedCity.setValue('')
  }

  updateLocation(city: string){
    !this.cityChips.includes(city) ?
    this.cityChips.push(city) : '';
    this.retrievePost(this.pageIndex, this.pageSize);
  }

  removeLocation(remove: String){
    this.cityChips = this.cityChips.filter(city => city !== remove);
    this.retrievePost(this.pageIndex, this.pageSize);
  }

  indeterminate(mainCtg: string){
    const subtasks = this.categories.find(ctg => ctg.name === mainCtg)?.subtasks

    if(subtasks?.every(task => task.completed)){
      this.categories.find(ctg => ctg.name === mainCtg ? ctg.completed = true : '')
      return false
    }
    else if(subtasks?.some(task => task.completed)){
      return true
    }
    this.categories.find(ctg => ctg.name === mainCtg ? ctg.completed = false : '')
    return false;
  }

  setAll(category: string) {
    const findCategory = this.categories.find(ctg=> ctg.name === category);

    if(findCategory){
      if(findCategory.completed){
        findCategory.subtasks?.map(tasks => tasks.completed = false);
        findCategory.completed = false;
      }
      else{
        findCategory.subtasks?.map(tasks => tasks.completed = true);
        findCategory.completed = true;
      }
    }
    this.filterChange()
  }

  postLength(): number{
    return this.posts ? this.posts['count'] : this.pageSize;
  }

  handlePage(e: PageEvent){
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.retrievePost(this.pageIndex, this.pageSize);
  }
  
  filterChange(){
    this.pageIndex = 0;
    this.retrievePost(this.pageIndex, this.pageSize);
  }

}

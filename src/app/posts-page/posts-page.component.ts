import { Component } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Categories from 'src/utility/category';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { PostsService } from '../services/posts.service';
import { FormControl } from '@angular/forms';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent {

  categories: Task[] = [];
  selectedCity = new FormControl('');
  cities = [  
    'Colombo',
    'Kandy',
    'Galle',
    'Jaffna',
    'Negombo',
    'Trincomalee',
    'Anuradhapura',
    'Polonnaruwa',
    'Batticaloa',
    'Matara',
    'Ratnapura',
    'Kurunegala',
    'Badulla',
    'Nuwara Eliya',
    'Hambantota',
    'Ampara',
    'Puttalam',
    'Mannar',
    'Kilinochchi',
    'Vavuniya',
    '-- None --'
  ];
  posts: any;
  pageSize: number = 8;
  pageIndex: number = 0;

  constructor(
    public dialog: MatDialog, 
    private postService: PostsService){
    this.categories = [];
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    Categories.forEach((element) => {
      if(element.mainCtg === history.state.data){
        this.filterCategory(element, true);
      } 
      else{
        this.filterCategory(element, false);
      }
    }) 
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

    if(this.cities.includes(String(this.selectedCity)) && String(this.selectedCity) !== '-- None --'){
      filter.location = this.selectedCity;
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

    this.filterChange()
  }

  filterChange(){
    this.retrievePost(this.pageIndex, this.pageSize);
  }

}

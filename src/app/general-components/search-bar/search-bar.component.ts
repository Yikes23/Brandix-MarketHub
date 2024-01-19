  import { Component } from '@angular/core';
  import { FormControl } from '@angular/forms';
  import { Router } from '@angular/router';
  import { Observable, catchError, debounceTime, distinctUntilChanged, startWith, switchMap, take, tap } from 'rxjs';
  import { PostsService } from 'src/app/services/posts.service';
import { SearchService } from 'src/app/services/search.service';


  interface Post {
    id: number;
    title: string;
    description: string;
    images: string;
    subCategory: string;
    category: string;
    location: string;
    postedBy: string;
    postedOn: string;
    price: string;
  }
  @Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
  })
  export class SearchBarComponent {

    searchCtrl = new FormControl('');
    filteredPosts: Observable<Post[]>;
    posts: Post[] = [];
    
    constructor(private postService: PostsService, private router: Router, private searchService: SearchService) {
      this.filteredPosts = this.searchCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((query) =>
          this.postService.getSuggestions(query).pipe(
            catchError(error => {
              console.error('Error fetching suggestions:', error);
              return [];
            }),
            tap((posts: Post[] | Object) => {
              if (Array.isArray(posts)) {
                this.posts = posts; // Update this.posts only if it's an array
              } else {
                console.error('Invalid response format:', posts);
              }
            })
          )
        )
      ) as Observable<Post[]>;
    
      this.filteredPosts.subscribe((post: Post[]) => this.posts = post);
    }    

    clearSearch(){
      this.searchCtrl.setValue('')
    }

    viewPost(data: any){
      if(data.option){
        console.log(this.posts)
        const post = this.posts.find((post) =>{
          return post.title === data.option.value
        })
        if(post){
          this.searchService.updateSearchData(post);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/viewPost', post?.id]);
          });
        }
      }
    }
  }

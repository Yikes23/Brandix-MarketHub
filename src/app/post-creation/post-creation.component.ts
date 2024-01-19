import { AfterViewChecked, AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import Categories from 'src/utility/category';
import Typed from 'typed.js';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageUploadService } from '../general-components/image-upload/image-upload.services';
import * as _ from 'lodash';
import { PostsService } from '../services/posts.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-creation',
  templateUrl: './post-creation.component.html',
  styleUrls: ['./post-creation.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  animations:[
    
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0,
        display: 'none',
      })),
      state('visible', style({
        opacity: 1,
        display: 'block',
      })),
      transition('hidden => visible', [
        animate('1000ms ease-in')
      ]),
    ]),
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
      })),
      state('expanded', style({
        height: '*',
      })),
      transition('collapsed => expanded', [
        animate('500ms ease-in-out')
      ]),
      transition('expanded => collapsed', [
        animate('750ms ease-in-out')
      ]),
    ]),

  ],
})
export class PostCreationComponent {
  
  isStepperVisible: boolean = false;
  showNotification: 'expanded' | 'collapsed' = 'collapsed';
  stepperState: 'expanded' | 'collapsed' = 'collapsed';
  fadeIn: 'hidden' | 'visible' = 'hidden';
  categories = Categories;
  form: any;

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
    'Vavuniya'
  ];

    @ViewChild('nestedStepper') nestedStepper: MatStepper | undefined;
    @ViewChild('stepper') stepper: MatStepper | undefined;

    jwtHelper = new JwtHelperService();

    constructor(
      private fb: FormBuilder, 
      private router: Router,
      private authService: AuthService,
      private imageUploadService: ImageUploadService, 
      private postService: PostsService
      ) {
      this.form = this.fb.group({
        category: ['', Validators.required],
        subCategory: ['', Validators.required],
        location: ['', Validators.required],
        title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(0)]],
        price: new FormControl({value:'', disabled: false}, [
          Validators.min(0),
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]),        
        postedBy: '',
        postedOn: '',
        images: [], // Array of image URLs
      });
    }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      const element = document.getElementById('typewriter')
      const typed = new Typed(element, {
        strings: ['Hi, there...','Looking to sell ?'],
        typeSpeed: 40,
        cursorChar: ' ',
        backSpeed: 20, 
        showCursor: true,
        loop: false,
      })
    
      setTimeout(() => {
        this.isStepperVisible = true;
        this.stepperState = 'expanded'; // Initial state after delay
        setTimeout(() => {
          this.fadeIn = 'visible';
        }, 2000)
      }, 3750)
    }

  returnSubCategory(): string[] | undefined{

    if (this.form.get('category').value) { 
      const selectedMainCategory = this.categories.find(ctg => ctg.mainCtg === this.form.get('category').value);
      return selectedMainCategory?.subCtg
    }
    return [];
  }
  negotiable(){
    this.form.get('price').enabled ? 
    this.form.get('price').disable() :
    this.form.get('price').enable();
  }

  goToLocationStep() {
    if (this.stepper) {
      this.stepper.selectedIndex = 1;
    }
  }

  navigateTo(location: string) {
    this.router.navigate([`/${location}`])
  }

  validateTitle(title: string): boolean {
    return title.length > 0 && title.length <= 50;
  }
  
  hasErrors(){
    return _.keys(this.form.controls).some(key => {
      return this.form.get(key)?.errors !== null
    })
  }

  submit(){

    const token = this.authService.getToken()
    this.imageUploadService.getImageData().subscribe(data =>{
      this.form.get('images').setValue(data);
    })
    this.form.get('price').disabled ?
    this.form.get('price').setValue('') : '';
    this.form.get('postedBy').setValue(token.email)
    this.form.get('postedOn').setValue(new Date().toLocaleString()) 
    this.postService.createPost(this.form.value)
    this.stepperState = 'collapsed';
    this.showNotification = 'expanded';
  }
}

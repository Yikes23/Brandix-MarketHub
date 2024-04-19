import { AfterViewChecked, AfterViewInit, Component, Pipe, PipeTransform, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import Categories from 'src/utility/category';
import Typed from 'typed.js';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ImageUploadService } from '../general-components/image-upload/image-upload.services';
import * as _ from 'lodash';
import { PostsService } from '../services/posts.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

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
  
  private routeSubscription: Subscription;
  isStepperVisible: boolean = false;
  conditions: boolean = false;
  showNotification: 'expanded' | 'collapsed' = 'collapsed';
  stepperState: 'expanded' | 'collapsed' = 'collapsed';
  fadeIn: 'hidden' | 'visible' = 'hidden';
  categories = Categories;
  form: any;

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

        this.routeSubscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            // Clear uploadedImage data when the route changes
            this.imageUploadService.clearImageData();
          }
        });

      this.conditions = this.authService.getDisclaimer();
      this.form = this.fb.group({
        category: ['', Validators.required],
        subCategory: ['', Validators.required],
        location: ['', Validators.required],
        title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(0)]],
        price: new FormControl({value:'', disabled: false}, [
          // Validators.min(0),
          Validators.required,
          // Validators.maxLength(15)
        ]),
        negotiable: false,        
        postedBy: '',
        postedOn: '',
        images: [], 
      }) as FormGroup;
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

  updateNegotiable(){
    this.form.get('negotiable').value = !this.form.get('negotiable').value;
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

  formatPrice(){
    this.form.get('price').setValue(new NumberWithCommasPipe().transform(this.form.get('price').value));
  }
  
  hasErrors(){
    return _.keys(this.form.controls).some(key => {
      return this.form.get(key)?.errors !== null
    })
  }

  submit(){

    const token = this.authService.getToken()
    this.imageUploadService.getImageData().subscribe(data => {
      this.form.get('images').setValue(data);
    }).unsubscribe();
    this.imageUploadService.clearImageData();

    this.form.get('price').disabled ?
    this.form.get('price').setValue('') : '';

    this.form.get('postedBy').setValue(token.email)
    this.form.get('description').setValue(String(this.form.get('description').value).trim())
    this.form.get('postedOn').setValue(new Date()) 

    try {
      this.postService.createPost(this.form.value)
    } catch (error) {
      throw console.error(error)
    }

    this.stepperState = 'collapsed';
    this.showNotification = 'expanded';
  }

  ngOnDestroy(): void {
    // Unsubscribe from router events when the component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}


  @Pipe({ name: 'numberWithCommas' })
  export class NumberWithCommasPipe implements PipeTransform {
    transform(value: any): string {

      value = String(value).replaceAll(',', '')
      if(!isNaN(parseFloat(value))){
        const val = parseFloat(value);
        return new Intl.NumberFormat('en-US').format(val)
      }
      return '';
    }
  }
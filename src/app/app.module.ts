import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './general-components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './general-components/search-bar/search-bar.component';
import { FooterComponent } from './general-components/footer/footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ImageUploadComponent } from './general-components/image-upload/image-upload.component';
import { RequirementsComponent } from './general-components/requirements/requirements.component';
import { ReviewPostComponent, ViewPostComponent } from './view-post/view-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './admin/admin.component';
import { PostsComponent } from './general-components/posts/posts.component';
import { AdminAuthGuard, AuthGuard } from './services/auth.guard';
import { RatingComponent } from './general-components/rating/rating.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    HeaderComponent,
    SearchBarComponent,
    FooterComponent,
    PostsPageComponent,
    PostCreationComponent,
    UserProfileComponent,
    ImageUploadComponent,
    RequirementsComponent,
    ViewPostComponent,
    ReviewPostComponent,
    AdminComponent,
    PostsComponent,
    RatingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    FormsModule,
    HttpClientModule,
    MatCardModule, 
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatGridListModule,
    MatPaginatorModule,
    MatDividerModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatStepperModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgbCarouselModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, 
      useValue: { hasBackdrop: false } }, 
    AuthGuard,
    AdminAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

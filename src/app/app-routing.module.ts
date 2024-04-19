  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { HomePageComponent } from './home-page/home-page.component';
  import { LoginPageComponent } from './login-page/login-page.component';
  import { PostsPageComponent } from './posts-page/posts-page.component';
  import { PostCreationComponent } from './post-creation/post-creation.component';
  import { UserProfileComponent } from './user-profile/user-profile.component';
  import { ViewPostComponent } from './view-post/view-post.component';
  import { AdminComponent } from './admin/admin.component';
  import { AdminAuthGuard, AuthGuard } from './services/auth.guard';
// import { MasterAdminComponent } from './master-admin/master-admin.component';

  const routes: Routes = [
    { path: 'admin', component: AdminComponent, canActivate: [AdminAuthGuard]},
    // { path: 'master', component: MasterAdminComponent, canActivate: [AdminAuthGuard]},
    { path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginPageComponent},
    { path: 'posts', component: PostsPageComponent, canActivate: [AuthGuard]},
    { path: 'createPost', component: PostCreationComponent, canActivate: [AuthGuard]},
    { path: 'viewPost/:id', component:  ViewPostComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '/home' },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { InterceptorService } from "./interceptor.service";

import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { NavComponent } from './components/nav/nav.component'
import { ListComponent } from './components/list/list.component'
import { PageComponent } from './components/page/page.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'

import { UserComponent } from './components/user/user.component'
import { CommunityComponent } from './components/community/community.component'
import { DetailComponent } from './components/detail/detail.component'
import { CommentComponent } from './components/comment/comment.component'
import { CommentSubmitComponent } from './components/commentsubmit/commentsubmit.component'

//页面
import { ContentComponent } from './views/content/content.component'

import { IndexComponent } from './views/index/index.component'
//注入服务
import { IndexService } from './views/index/index.service'
import { ContentService } from './views/content/content.service'
const appRoutes:Routes = [
  { path: '', component: IndexComponent },
  { path: ':navId', component: IndexComponent },
  // { path: ':navId/page/:page', component: IndexComponent },
  { path: ':navId/detail/:id', component: ContentComponent }
  
];

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ListComponent,
    PageComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    CommunityComponent,
    DetailComponent,
    CommentComponent,
    CommentSubmitComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    RouterModule.forRoot(
      appRoutes,{ enableTracing: false }
    )
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [ HttpClientModule,IndexService,ContentService,{provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true} ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

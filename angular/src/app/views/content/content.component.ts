import { Component, OnInit,Input } from '@angular/core';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { ContentService } from './content.service';

class Nav {
   _id:string;
   name:string;
   url?:string;
}

class Content{
  _id:string;
  addTime:string;
  views:string;
  content:string;
  title:string;
  description:string
}

interface User{
  username:string;
  password:string;
}

class Comment {
  contentId:string;
  content:string;
}

@Component({
  selector: 'blog-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private contentService: ContentService,private route: ActivatedRoute) {
     
  }
  navs : Array<Nav>;
  content: Content;
  nowState: string = 'login';
  userInfo = null;
  comments: Array<Comment>;
  id: string;
  ngOnInit() {
    this.contentService.isLogin().subscribe(data =>{
        if(data && data['userInfo']){
           this.userInfo = data['userInfo'];  
        }
    });
  	this.contentService.getNavList().subscribe(data => {
        this.navs = [];
        this.navs.push({ _id:'',name:'首页',url:'/index' });
        // this.navs = data.catepories;
        // console.log(data,"data")
         if(data.catepories && data.catepories.length !== 0){
            data.catepories.forEach(item=>{
               item.url = `/${item._id}`
            });
           this.navs = this.navs.concat(data.catepories);
         }
    });
    this.route.params.subscribe((params) => {
       if(params.id){
          this.id = params.id;
          this.contentService.getDetail(params.id).subscribe(data => {
              this.content = data.content;
              this.comments = data.content.comments;
          });
       }
    });
    
  }
  toggle(value:string){
     this.nowState = value;
  }
  login(user:User){
    console.log(user,"index.component.ts")
    this.contentService.login(user).subscribe(data => {
        if(data && data['userInfo']){
           this.userInfo = data['userInfo'];  
        }
    })
  }

  logoutHandle() {
    this.contentService.logout().subscribe(data => {
        this.userInfo = null;  
    })
  }
  submitHandle(value){

     let commetData = {
         contentId: this.id,
         content: value.content
     };
     this.contentService.submitCommetHandle(commetData).subscribe(data => {
        // if (data && data.data) {
        //   this.content = data.data;
        //   this.comments = data.data.comments; 
        // }
     })
  }
}

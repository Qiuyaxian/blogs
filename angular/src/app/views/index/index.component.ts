import { Component, OnInit,Input } from '@angular/core';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';
import { IndexService } from './index.service';

class Nav {
   _id:string;
   name:string;
   url?:string
}

class ListItem{
  _id:string;
  user:string;
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



@Component({
  selector: 'blog-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private indexService: IndexService,private router:Router,private route: ActivatedRoute) {
     
  }
  nowIndex:string;
  navs : Array<Nav>;
  ListItems:Array<ListItem>;
  pageUrl:string;
  nowPage:number = 1;
  nowPageCount:number = 1;
  nowState:string = 'login';
  userInfo = null;
  ngOnInit() {
    this.indexService.isLogin().subscribe(data=>{
        if(data && data['userInfo']){
           this.userInfo = data['userInfo'];  
        }
    });
    this.indexService.getNavList().subscribe(data => {
        this.navs = [];
        this.navs.push({ _id:'',name:'首页',url:'/index' });
         if(data.catepories && data.catepories.length !== 0){
            data.catepories.forEach(item=>{
               item.url = `/${item._id}`
            });
           this.navs = this.navs.concat(data.catepories);
         }
    });
    this.route.params.subscribe((params) => {
       if(params.navId){
          this.nowIndex = params.navId;
       }else{
          this.nowIndex = 'index';
       }
       this.route.queryParams.subscribe((qparams) => {
           this.nowPage = qparams.page?qparams.page:1;
       });
       this.getList(this.nowIndex,this.nowPage);
    });

  }
  
  prevHandle(){
    if(--this.nowPage >= 1){
      let navigationExtras:NavigationExtras = { 
        queryParams:{ 
          page:this.nowPage 
        },
        preserveFragment: true,
        replaceUrl: true 
      };
      this.router.navigate([`/${this.nowIndex}`], navigationExtras);
      this.getList(this.nowIndex,this.nowPage);
    }else{
      this.nowPage = 1;
    }
  }
  nextHandle(){
    
    if(++this.nowPage <= this.nowPageCount){
      let navigationExtras:NavigationExtras = { 
        queryParams:{ 
          page:this.nowPage 
        },
        preserveFragment: true,
        replaceUrl: true 
      };
      this.router.navigate([`/${this.nowIndex}`], navigationExtras);
      this.getList(this.nowIndex,this.nowPage);
      
    }else{
      this.nowPage = this.nowPageCount;
    }
  }
  getList(navIndex,page?:number):any{
    this.indexService.getList(navIndex,page).subscribe(data => {
        this.ListItems = data.contents;
        this.nowPage = data.page;
        this.nowPageCount = data.pages; 
    });
  }

  toggle(value:string){
     this.nowState = value;
  }
  login(user:User){
    console.log(user,"index.component.ts")
    this.indexService.login(user).subscribe(data => {
        if(data && data['userInfo']){
           this.userInfo = data['userInfo'];  
        }
    })
  }

  logoutHandle() {
    this.indexService.logout().subscribe(data => {
        this.userInfo = null;  
    })
  }

}


2573912586
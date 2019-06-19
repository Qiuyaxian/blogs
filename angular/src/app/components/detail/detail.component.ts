import { Component,Input,OnInit } from '@angular/core';

class Nav {
   _id:string;
   name:string;
   url?:string
}

class Content{
  _id:string;
  addTime:string;
  views:string;
  content:string;
  title:string;
  description:string
}

@Component({
  selector: 'blog-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
   @Input() data: Array<Nav>;
   @Input() content: Content;
   navs: Array<Nav>;
   constructor() {
   	  
   }
   ngOnInit() {
   	  this.navs = [];
   	  this.navs.push({ _id:'',name:'首页',url:'/index' });
   	  if(this.data && this.data.length !== 0){
   	  	 this.data.forEach(item=>{
             item.url = `/classfily/${item._id}`
   	  	 });
         this.navs = this.navs.concat(this.data);
         console.log(this.navs,this.data)
   	  }

       console.log(this.content,"detail.component.html")
   	  
   }
}

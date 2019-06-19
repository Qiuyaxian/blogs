import { Component,Input,OnInit } from '@angular/core';

class Nav {
   _id:string;
   name:string;
   url?:string
}

@Component({
  selector: 'blog-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
   @Input() navs: Array<Nav>;
   constructor() {
   	  
   }
   ngOnInit() {
   	 
   	  
   }
}

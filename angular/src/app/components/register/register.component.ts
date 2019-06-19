import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'blog-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
   @Output() toggleFun = new EventEmitter();
   
   constructor() {

   }
   
   toggle(value) {
      this.toggleFun.emit(value);
   }

}

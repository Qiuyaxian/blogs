import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'blog-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {
	@Output() prev = new EventEmitter();
    @Output() next = new EventEmitter();
    @Input() url:string;
    @Input() page:number = 1;
    @Input() count:number = 1;
    constructor() {

    }
	prevHandle(){
      this.prev.emit();
	}
	nextHandle(){
      this.next.emit();
	}
}

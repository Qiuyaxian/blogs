import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'blog-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
	@Output() logout = new EventEmitter();
	constructor() {

	}
	logoutHandle() {
       this.logout.emit();
	}
}

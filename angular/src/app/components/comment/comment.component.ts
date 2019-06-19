import { Component,Input } from '@angular/core';

class commentItem {
	username:string;
	content:string;
}

@Component({
  selector: 'blog-comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
	@Input() item: commentItem;
}

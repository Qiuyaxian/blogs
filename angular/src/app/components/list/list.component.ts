import { Component,Input } from '@angular/core';

class ListItem{
  _id:string;
  user:string;
  addTime:string;
  views:string;
  content:string;
  title:string;
  description:string
}

@Component({
  selector: 'blog-list-item></blog-list-item',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  @Input() nowIndex:string;
	@Input() item: ListItem;
}

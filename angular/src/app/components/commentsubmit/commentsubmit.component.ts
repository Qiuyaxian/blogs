import { Component,EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';

class Comment {
   content:string 	 
}

@Component({
  selector: 'blog-comments-submit',
  templateUrl: './commentsubmit.component.html',
  styleUrls: ['./commentsubmit.component.css']
})
export class CommentSubmitComponent implements OnInit{
	@Output() submitData =  new EventEmitter();
    comment:FormGroup;
    constructor(private fb: FormBuilder) {
        
	}
	ngOnInit(){
		this.comment = this.fb.group({
	      content: ['', [Validators.required]]
	    });
    }
	submitHandle({ value, valid }: { value: Comment, valid: boolean }):any{
  		let contentValid = this.comment.get('content').errors;
  		if(contentValid && contentValid.required){
             alert('评论内容不能为空');
             return false;
  		}
    	if(valid){
    		this.submitData.emit(value);
    	}
    }
}

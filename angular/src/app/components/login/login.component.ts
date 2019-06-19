import { Component,EventEmitter, Output,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';

interface User{
	username:string;
	password:string;
}

@Component({
  selector: 'blog-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

	@Output() toggleFun = new EventEmitter();
	@Output() loginFun = new EventEmitter();
    user:FormGroup;
	constructor(private fb: FormBuilder) {
        
	}
    ngOnInit(){
		this.user = this.fb.group({
	      username: ['', [Validators.required]],
	      password: ['',Validators.required]
	    });
    }

	toggle(value) {
		
      this.toggleFun.emit(value);
    }

    onSubmit({ value, valid }: { value: User, valid: boolean }) {
    	if(valid){
    		this.loginFun.emit(value);
    	}
    }
}
// export class LoginComponent {

// 	@Output() toggleFun = new EventEmitter();
//     user:FormGroup;
// 	constructor() {
        
	// }
 //    ngOnInit(){
 //    	this.user = new FormGroup({
	//       username: new FormControl('',[Validators.required, Validators.minLength(2)]),
	//       password: new FormControl('')
	//     });
 //    }

// 	toggle(value) {
//       this.toggleFun.emit(value);
//     }

//     onSubmit({ value, valid }: { value: User, valid: boolean }) {
//     	 console.log(value, valid);
//     }
// }

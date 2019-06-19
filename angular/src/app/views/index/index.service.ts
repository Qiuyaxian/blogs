import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User{
  username:string;
  password:string;
}

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(private http: HttpClient) { 
  }
  getNavList():any{
  	return this.http.get('http://localhost:8082/api/classfily');
  }
  getList(navId,page?:number):any{
  	if(navId == 'index'){
      return this.http.get(`http://localhost:8082/api/index?page=${page}`);
  	}else{
  	  return this.http.get(`http://localhost:8082/api/index?catepory=${navId}&page=${page}`);
  	}
  }
  
  login(user:User){
    let data = `username=${user.username}&password=${user.password}`;
    return this.http.post(`http://localhost:8082/api/login`,data,{
      headers:{
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }
  logout() {
    return this.http.get(`http://localhost:8082/api/logout`);
  }
  isLogin(){
    return this.http.get(`http://localhost:8082/api/isLogin`);
  }
}
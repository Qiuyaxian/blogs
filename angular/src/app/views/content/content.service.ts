import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

class Content{
  _id:string;
  addTime:string;
  views:string;
  content:string;
  title:string;
  description:string
}
interface User{
  username:string;
  password:string;
}

class Commet{
  contentId:string;
  content:string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private http: HttpClient) { 
  }
  getNavList():any{
  	return this.http.get('http://localhost:8082/api/classfily');
  }
  getDetail(id:string): any{
    return this.http.get(`http://localhost:8082/api/view?contentId=${id}`); 
  }
  submitCommetHandle(commet:Commet){
    let data = `contentId=${commet.contentId}&content=${commet.content}`;
    return this.http.post(`http://localhost:8082/api/comment/post`,data,{
      headers:{
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
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
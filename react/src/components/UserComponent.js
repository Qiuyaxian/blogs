import React from 'react';
import { Link } from 'react-router-dom';
import $axios from '../utils';
export default class UserComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
      
    };
	}

  componentDidMount(){
       
  }
   
  loginOutHandle() {
     let _this = this;
     $axios.get('/logout').then((res)=>{
         this.props.Logout();
     }).catch(()=>{
      
     });
  }

	render() {
    
		return (
			 <div className="rightBox">
          <div className="title"><span>用户信息</span></div>
          <p><span className="colDark">Fantaghiro</span></p>
          <p>
              <span className="colDanger">你好，管理员！</span>
              <Link to="/admin">进入管理</Link>
          </p>

          <p><span className="colDanger">你好，欢迎光临我的博客！</span></p>

          <p><span className="colDark loginout" onClick={this.loginOutHandle.bind(this)}>退出</span></p>
       </div>
		)
	}
}

import React from 'react';
import ReactDom from 'react-dom';

 
export default class LonginComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

    componentDidMount(){
         
    }

	render() {
		return (
			<div className="rightBox" id="registerBox">
	            <div className="title"><span>注册</span></div>
	            <div className="line"><span className="colDark">用户名：</span><input type="text" name="username" /></div>
	            <div className="line"><span className="colDark">密码：</span><input type="password" name="password" /></div>
	            <div className="line"><span className="colDark">确认：</span><input type="password" name="repassword" /></div>
	            <div className="line"><span className="colDark"></span>
	                <button>注 册</button>
	            </div>
	            <p className="textRight">已有账号？<a href="javascript:;" className="colMint">马上登录</a></p>
	            <p className="colWarning textCenter"></p>
	        </div>
		)
	}
}

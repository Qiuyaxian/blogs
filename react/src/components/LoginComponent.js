import React from 'react';
import { Link } from 'react-router-dom';
import $axios from '../utils'
import qs from 'qs'
import { Form, Input, Row, Col, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
class LonginComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	toggle:'login'
	  };
	}

    componentDidMount(){
            
    }
    submitHandle(e) {
        e.preventDefault(); //阻止默认提交方式
        var myFetchOptions = {
       	  methods:'GET'
        };
        this.props.form.validateFields((err, values) => {

	      if (!err) {
	        $axios.post('/login',qs.stringify(values),{
	        	headers:{
	        	   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        	}
	        }).then((response)=>{
		        
                this.props.Login(response.data.userInfo)
		        //PubSub.publish("login",response.data.userInfo); 
		    });
	      }
	    });
	}
	toggleHandel(value) {
		console.log(value,'toggleHandel')
	    this.setState({
	       toggle:value
	    });
	}
	render() {
		let { getFieldDecorator } = this.props.form;
		let formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 5 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 19 },
	      }
		};


		let nowState;
	    if( this.state.toggle === 'login' ){
	       nowState = (<div>
                
	            <div className="title"><span>登录</span></div>
	            <Form onSubmit={ this.submitHandle.bind(this) }>
                    <FormItem
			          {...formItemLayout}
			          label="用户名："
			        >
			          {getFieldDecorator('username', {
			            rules: [{
			              required: true, message: '请输入用户名',
			            }],
			          })(
			            <Input />
			          )}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="密码："
			        >
			          {getFieldDecorator('password', {
			            rules: [{
			              required: true, message: '请输入密码',
			            }, {
			              validator: this.validateToNextPassword,
			            }],
			          })(
			            <Input type="password" />
			          )}
			        </FormItem>
			        <FormItem>
			          <Button type="primary" htmlType="submit">登 录</Button>
			        </FormItem>
                </Form> 
	            <p className="textRight">还没注册？<span onClick={ () => this.toggleHandel('register') } className="colMint pointer">马上注册</span></p>
	            <p className="colWarning textCenter"></p>
	        </div>);
	    }else{
	      nowState = (<div>
              <div className="title"><span>注册</span></div>
              <Form onSubmit={ this.submitHandle.bind(this) }>
	                <FormItem
			          {...formItemLayout}
			          label="用户名："
			        >
			          {getFieldDecorator('username', {
			            rules: [{
			              required: true, message: '请输入用户名',
			            }],
			          })(
			            <Input />
			          )}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="密码："
			        >
			          {getFieldDecorator('password', {
			            rules: [{
			              required: true, message: '请输入密码',
			            }, {
			              validator: this.validateToNextPassword,
			            }],
			          })(
			            <Input type="password" />
			          )}
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="确认："
			        >
			          {getFieldDecorator('password', {
			            rules: [{
			              required: true, message: '请输入密码',
			            }, {
			              validator: this.validateToNextPassword,
			            }],
			          })(
			            <Input type="password" />
			          )}
			        </FormItem>
			        <FormItem>
			          <Button type="primary" htmlType="submit">注 册</Button>
			        </FormItem>
	          </Form>
              <p className="textRight">已有账号？<span onClick={ () => this.toggleHandel('login') } className="colMint pointer">马上登录</span></p>
              <p className="colWarning textCenter"></p>
          </div>);
	    }
		
		return (
		  <div className="rightBox">	
			{ nowState }
		  </div>
		)
	}
}
//使用表单前必须先调用此方法
export default LonginComponent = Form.create({})(LonginComponent);
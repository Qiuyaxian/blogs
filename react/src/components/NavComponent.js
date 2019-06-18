import React from 'react';
import { Link,NavLink } from 'react-router-dom'
import $axios from '../utils'
//头部导航
export default class NavComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    	catepories:[]
    };
  }
  componentWillMount() {
    //获取分类
    //加载分类
	// $axios.get('/classfily').then((response)=>{
	      
 //      if(response.data && response.data.catepories){
 //        _this.setState({
 //            catepories:response.data.catepories
 //        });
 //      }
	// });
  }
  componentDidMount() {

  }
  render() {
    let _this = this,
        nav = this.props.nav,
        navList = [];
    if(nav && nav.length !== 0){
        nav.forEach((item,index)=>{
            navList.push( <NavLink to={'/index/'+item._id} activeClassName='focus' key={index} replace>{ item.name }</NavLink> )
        });
    }
    
    return (
	     <header className='headers'>
	         <div className='headerDiv'>
	         <div className="backimg"><img src="../static/images/IMG_0293.jpg" alt=""/></div>
	         <div className="logo"><img src="../static/images/00002637.png" alt="" /></div>
	     </div>
	     <nav>
	        <div className="menu clear">
	            <NavLink to='/' activeClassName='focus' key="index" replace>首页</NavLink>
	            { navList }
	        </div>
	     </nav>
	    </header>
    )
  }
}

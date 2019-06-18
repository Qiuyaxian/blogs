import { connect } from 'react-redux';
//=====引入组件=====
import LogoutComponent from '../../components/UserComponent.js';
//=====react-redux 封装组件=====
import { logout } from '../action'
// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapState(state,ownProps){
	return{
	    userInfo:state.userInfo
	}
}

// 哪些 action 创建函数是我们想要通过 props 获取的？
function mapDispatch(dispatch,ownProps){
	return {
	    Logout:()=>{
	        dispatch(logout())
	    }
	}
}
//封装传递state和dispatch
var LogoutComponentReactRedux = connect(mapState,mapDispatch)(LogoutComponent);

export default LogoutComponentReactRedux
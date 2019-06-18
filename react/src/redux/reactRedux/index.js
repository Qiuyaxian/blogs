import { connect } from 'react-redux';
//=====引入组件=====
import IndexComponent from '../../components/IndexComponent.js';
//=====react-redux 封装组件=====
import { login } from '../action'
// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapState(state,ownProps){
	console.log(state,"state")
	return{
	    userInfo:state.userInfo
	}
}

// 哪些 action 创建函数是我们想要通过 props 获取的？
function mapDispatch(dispatch,ownProps){
	return {
	    Login:(value)=>{
	       dispatch(login(value))
	    }
	}
}
//封装传递state和dispatch
var IndexComponentReactRedux = connect(mapState,mapDispatch)(IndexComponent);

export default IndexComponentReactRedux
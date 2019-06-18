import {Increment,Decrement,Login} from '../action'
export default (state,action)=>{
    const { counterCaption,userInfo } = action;
    switch (action.type){
        case 'login':
        	return Object.assign({},{...state},{'userInfo':userInfo});	
        case 'logout':
            return Object.assign({},{...state},{'userInfo':{}});  
        default:
        	return state;
    }
}
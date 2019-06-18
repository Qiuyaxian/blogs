import React from 'react';
import { Link } from 'react-router-dom'
export default class ListBoxComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

    componentDidMount(){
       //console.log(this.props.Increment(),"ListBoxComponent.js")
       // console.log(this.props,"ListBoxComponent.js")
    }
    

	render() {
		 
		return (
			<div className="listBox">
			    
	            <h1>{ this.props.item.title }</h1>
	            <p className="colDefault">
	                作者：<span className="colInfo">{ this.props.item.user }一</span> -
	                时间：<span className="colInfo">{ this.props.item.addTime }</span> -
	                阅读：<span className="colInfo">{ this.props.item.views }</span> -
	                评论：<span className="colInfo">{ this.props.item.comments.length }</span>
	            </p>
	            <dfn><p>{ this.props.item.content }</p></dfn>
	            <div className="function"><Link to={
	            	{
				       pathname:`/view/${this.props.item._id}`,
				       state:{}
				    }
	            }>阅读全文</Link></div>
	        </div> 
		)
	}
}

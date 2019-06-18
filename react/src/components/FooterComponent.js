import React from 'react';
import ReactDom from 'react-dom';
export default class FooterComponent extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {};
  }
  render() {
    return (
      <footer className='footers'>
          <div className="copyright textCenter">Copyright 版权所有，翻版必究</div>
      </footer>
    )
  }
}


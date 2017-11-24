import React, { Component } from 'react';
import ToolTip from './ToolTip';

export default class AddItem extends Component {

  render() {

   const { tooltip, onClick } = this.props;

   const plusSignStyle = {
      display: 'flex',
      flexFlow: 'column wrap',
       alignItems: 'flex-start',

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid',
      cursor: 'pointer',
//      marginBottom: 7
    };

    return (
      <div style={plusSignStyle} 
           onClick={onClick}>
        <ToolTip placement="right" tooltip={tooltip}>
           <span><i className="fa fa-plus fa-lg" aria-hidden="true"></i></span>
        </ToolTip>
      </div>
    );
  }
}

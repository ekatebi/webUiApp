import React, { Component } from 'react';
import { Tooltip, OverlayTrigger }
  from 'react-bootstrap';

export default class ToolTip extends Component {

  render() {

     const { tooltip, placement, children, multiline } = this.props;

     if (!tooltip || window.isMobile) {
      return (
        <div>
          {children}
        </div>
      );
     }

     if (Array.isArray(tooltip)) {

      const tooltipDiv = tooltip.map((item, index) => {
        return (<p key={index}>{item}</p>); 
      });

      return (<OverlayTrigger delayShow={500} delayHide={100} placement={`${placement}`} overlay=
          {(<Tooltip id="tooltip">{tooltipDiv}</Tooltip>)}>
          {children}
        </OverlayTrigger>);
     }

    return (<OverlayTrigger delayShow={500} delayHide={100} placement={`${placement}`} overlay=
        {(<Tooltip id="tooltip">{`${tooltip}`}</Tooltip>)}>
        {children}
      </OverlayTrigger>);
  }
}

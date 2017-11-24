import React, { Component, PropTypes } from 'react';
import { DragSource as dragSource } from 'react-dnd';
import Panel from './Panel';
import { DndItemTypes } from '../constant/dndItemTypes';
import { getPosition } from '../service/dom';

const panelSource = {
  beginDrag: (props, monitor, component) => {
    // console.log('beginDrag component', component, component.props);
    // component.show(false);
    const { elemId, mouseX, mouseY, position } = component;
    return { elemId, mouseX: mouseX - position.x, mouseY: mouseY - position.y };
  },

  endDrag: (props, monitor, component) => {
    // console.log('endDrag component', component, component.props);

//    console.log('endDrag', monitor.didDrop(), component);
      
    if (!monitor.didDrop() || !component) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
//      console.log('endDrag not dropped');
      return;
    }

    component.show(true);
    
    const dropResult = monitor.getDropResult();
  },

  canDrag: (props) => {
    return true;
  }

};

const collect = (connect, monitor) => {

  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};

class DevicePopupPanel extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.show = this.show.bind(this);
    this.state = { show: true };
    this.compName = 'DevicePopupPanel';
    this.position = { x: 0, y: 0 };
    this.mouseX = 0;
    this.mouseY = 0;
    this.elemId = '';
    this.elem = undefined;
  }

  componentWillMount() {
    const { id } = this.props.settings;
    this.elemId = `${this.compName}-${id}`;
  }

  componentDidMount() {
    this.elem = document.getElementById(this.elemId);
    this.updatePosition();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePosition();
  }

  updatePosition() {
    this.position = getPosition(this.elem);
  }

  show(show) {
    if (!show) {
      setTimeout(() => {
        this.setState({ show });
      }, 100);
    } else {
      this.setState({ show });
    }
  } 

  render() {

    const { show } = this.state;

    const { settings, position,
      connectDragSource, connectDragPreview, isDragging, canDrag
    } = this.props;

    const { id, title } = settings;

    const handleStyle = {
      position: 'absolute',
      width: '85%',
      height: '38px',
      display: 'inline-block',
      marginRight: '0.75rem',
      cursor: canDrag ? 'move' : 'default'
    };

    const panelStyle = {
      position: 'fixed',
      top: `${position.y}px`,
      left: `${position.x}px`,
//      opacity: isDragging ? '0.5' : '1',
//      display: show ? 'flex' : 'none',
      display: isDragging ? 'none' : 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      zIndex: 99,

      borderWidth: '2px',
      borderColor: 'pink',
//      borderStyle: 'solid'

    };

    const panelStyle2 = {
      borderWidth: '2px',
      borderColor: 'lightgreen',
      borderStyle: 'solid'
    };
//  style={panelStyle2}
    let minHeight = 0;

    if (title.indexOf('Join') === 0) {
      minHeight = 300;
    }

    return connectDragPreview(
      <div style={panelStyle} id={this.elemId}>

        {connectDragSource(
          <div style={handleStyle}
            onMouseDown={(event) => {
//              console.log('down...');
              this.mouseX = event.clientX;
              this.mouseY = event.clientY;
//              this.props.settings.onMouseDown(true);
            }} />
        )}

        <Panel settings={settings} size={ { minHeight, maxHeight: 600 } } >
          {this.props.children}
        </Panel>

      </div>
    );
  }
}

module.exports = dragSource(DndItemTypes.DEVICE_POPUP_PANEL,
  panelSource, collect)(DevicePopupPanel);

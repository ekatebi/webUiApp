import React, { Component, PropTypes } from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import TreeView from 'react-treeview';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { confirm } from '../confirm/service/confirm';
// import _flow from 'lodash/flow';
// import * as actions from './actions';
import { getNodeId } from './constants';
// import { ZoneTreeNode as ZoneTreeNodeEx } from './container/ZoneTreeNode';
import ZoneTreeNodeEx from './container/ZoneTreeNode';

export class ZoneTreeNode extends Component {

  constructor(props) {
	  super(props);
    this.handleClickOnExpander = this.handleClickOnExpander.bind(this);
    this.handleClickOnLabel = this.handleClickOnLabel.bind(this);
  	this.state = { nodeId: undefined };
  }

  componentWillMount() {
		const { data } = this.props;
    
    this.setState((prevState, props) => ({
      nodeId: getNodeId(props.data)
    }));
  }

  handleClickOnExpander(e) {
    const { data, onRequestList, onReceiveUncollapsed, uncollapsed } = this.props;
    
    const collapsed = uncollapsed[data.id] !== true;

    if (collapsed) {
      onRequestList(data);
    }

    onReceiveUncollapsed(data, collapsed);
    e.stopPropagation();
  }

  handleClickOnLabel(e) {
    const { data, onRequestList, 
      onSelectZone, selected } = this.props;

    if (selected && data && selected.id === data.id) {
      onSelectZone();
    } else {
      onSelectZone(data);
    }

    e.stopPropagation();
  }

	render() {

		const { data, listObject, onSelectZone, onRequestList, uncollapsed, onReceiveUncollapsed,
      onRequestRemove, showEditor, selected, list, editorShowing } = this.props;
		const { nodeId } = this.state;

    const collapsed = uncollapsed[data.id] !== undefined ? !uncollapsed[data.id] : true;

    const zoneNodes = list
      .map((item, index) => {
        return (<ZoneTreeNodeEx key={index} data={item} />);
      });

    if (zoneNodes.length === 0) {
      zoneNodes.push(
        <span className="info" key={0}>none</span>
        );
    }

    let nodeLabelStyle = {};

    if (selected && selected.id === data.id) {
      nodeLabelStyle = { ...nodeLabelStyle, backgroundColor: '#a9b5fc' };
    }

		let nodeLabel = (
			<span className="node" style={nodeLabelStyle} onClick={this.handleClickOnLabel}>
        {window.diag ? `${data.name} (${data.id}, ${data.list.length})` : `${data.name} (${data.list.length})`}
      </span>);

    const noZoneMenu = (<MenuItem>
      <span><i className="fa fa-stop-circle-o" aria-hidden="true"></i>&nbsp;Disabled in Edit mode</span>
    </MenuItem>);

    const editZoneMenu = (<MenuItem onClick={(e) => {
      onSelectZone(data);
      showEditor(true, data);
      e.stopPropagation();
    }}>
      <span><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Edit Zone</span>
    </MenuItem>);

    const addSubZoneMenu = (<MenuItem onClick={(e) => {
      onSelectZone(data);
      showEditor(true);
      e.stopPropagation();
    }}>
      <span><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add Sub Zone</span>
    </MenuItem>);

    const removeZoneMenu = (<MenuItem onClick={(e) => {
      confirm('Are you sure?', {
        description: `Would you like to delete zone \"${data.name}\"?`,
        confirmLabel: 'Delete',
        abortLabel: 'Cancel'
      }).then(() => {       
        onRequestRemove(data.id, data.name);
      }).catch(() => {});

      e.stopPropagation();
    }}>
      <span><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Remove Zone</span>
    </MenuItem>);

    const contextMenu = (
      <div>{editorShowing ?  
        (<ContextMenu id={nodeId}>
          {noZoneMenu}
        </ContextMenu>)
        :
        (<ContextMenu id={nodeId}>
          {editZoneMenu}
          {addSubZoneMenu}
          {removeZoneMenu}
        </ContextMenu>)}
      </div>);

    nodeLabel = (<div>
        <ContextMenuTrigger id={nodeId} holdToDisplay={1000}>
          {nodeLabel}
          {contextMenu}
        </ContextMenuTrigger>
      </div>);

    return (
			<TreeView
	      nodeLabel={nodeLabel}
	      collapsed={collapsed}
				onClick={this.handleClickOnExpander}>
        <div className="tree-view-children">
          {zoneNodes}
        </div>
	    </TreeView>
    );
	}

}

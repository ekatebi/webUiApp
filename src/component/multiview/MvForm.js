import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl, SplitButton, MenuItem } 
  from 'react-bootstrap';
import * as actions from './actions';
import { confirm } from '../confirm/service/confirm';
import ToolTip from '../ToolTip';

class MvForm extends Component {

  constructor(props) {
    super(props);
    this.saveHandler = this.saveHandler.bind(this);
    this.state = {};
  }

  saveHandler() {
    const { item, itemChanged, onRequestSaveItem, saveAs, enableSaveAs, list } = this.props;

    const index = list.findIndex((listItem) => {
//      return listItem.gen.name.toLowerCase() === item.gen.name.toLowerCase();
      return listItem.gen.name === item.gen.name;
    });

    if (item.index > -1 || index < 0) {          
      onRequestSaveItem();
    } else {
      confirm('Are you sure?', {
        description: `Multiview by the same name of ${list[index].gen.name} already exists. \
        Would you like to proceed with save operation which will overwrite the existing multiview?`,
        confirmLabel: 'Yes',
        abortLabel: 'No'
      }).then(() => {
        itemChanged({ ...item, index });
        onRequestSaveItem();
      }).catch(() => {});
    }
  }

  render() {

    const { item, itemChanged, onRequestSaveItem, saveAs, enableSaveAs, enableRename } = this.props;

//    console.log('MvForm', item);

    const compStyle = {      
      display: 'flex',
//      flex: '1',
      minWidth: 350,
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',

      textAlign: 'left',

      borderWidth: '2px',
      borderColor: 'green',
//      borderStyle: 'solid'
//      marginTop: 20,
    };
//               disabled={item && item.index > -1}

    const saveStyle = {
      display: 'flex',
//      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      minWidth: 50, 
      marginLeft: 10,
//      opacity: item.dirty ? 1.0 : 0.5
//      borderWidth: '2px',
//      borderColor: 'pink',
//      borderStyle: 'solid'
    };

    let saveButtonDiv;

    if (item.index > -1) {    
      saveButtonDiv = (
        <SplitButton bsSize="small" style={saveStyle} title="Save" dropup 
          id="split-button-dropup-save"           
          onClick={(e) => {
            this.saveHandler();
            e.stopPropagation();
            }}>
          <MenuItem eventKey="1" 
            onClick={(e) => {
              enableSaveAs();
              e.stopPropagation();
              }}>Enable Save As</MenuItem>
          <MenuItem eventKey="2" 
            onClick={(e) => {
              enableRename(item.gen.name);
              e.stopPropagation();
              }}>Enable Rename</MenuItem>
        </SplitButton>);
    } else {
      saveButtonDiv = (
      <Button bsSize="small" style={saveStyle}
          disabled={(!item.dirty || !item.gen.name) && !saveAs}
          onClick={(e) => {
            this.saveHandler();
            e.stopPropagation();
            }}>{saveAs ? 'Save As' : 'Save' }
      </Button>);      
    }

    return (
      <div style={compStyle}>
            
            <FormControl className="input-sm" style={{ minWidth: 150, maxWidth: 250 }}
              disabled={item.index > -1}
              type="text"
              value={item && item.gen && item.gen.name ? item.gen.name : ''}
              autoFocus
              placeholder="Multiview Name"
              onChange={(e) => {
                const name = e.target.value;
                
                if (item.index > -1) {
                    confirm(`Would you like to create a copy of multiview \"${item.gen.name}\"?`, {
                      description: 'Name change for an existing multiview will result in cloning it under the new name.',
                      confirmLabel: 'Yes',
                      abortLabel: 'No'
                    }).then(() => {
                      itemChanged({ ...item, index: -1,
                        gen: { ...item.gen, name } });
                    }).catch(() => {
                    });
                  } else {
                    itemChanged({ ...item, gen: { ...item.gen, name } });
                  }
              }} />
              {saveButtonDiv}

      </div>);
  }
}

function mapStateToProps(state) {

  const { item, saveAs, list } = state.multiview;

  return {
    item,
    saveAs,
    list
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MvForm);


/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as zoneActions from './actions';
import * as filterActions from '../filter/actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl } 
  from 'react-bootstrap';
import ZoneEditList from './ZoneEditList';
import { confirm } from '../confirm/service/confirm';
import { fetchDeepDisplaysAndWallsOfZone } from './fetch';
import {
  MENU_ITEM_ZONES
} from '../appMenu/constants';
import Panel from '../Panel';
import { parentIdKey } from './constants';

class ZoneForm extends Component {

  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getDeepItem = this.getDeepItem.bind(this);
    this.state = { deepZoneItem: undefined };
    this.hideFilter = this.hideFilter.bind(this);
    this.id = 'ZoneForm';
  }

  componentWillMount() {
    const { rootZone } = this.props;
    this.getDeepItem(rootZone);
    this.hideFilter(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getDeepItem(nextProps.rootZone);      
    this.hideFilter(nextProps);
  }

  getDeepItem(rootZone) {
    if (rootZone) {
      fetchDeepDisplaysAndWallsOfZone(rootZone)
        .then((deepZoneItem) => {
          deepZoneItem.name = rootZone.name;
//          console.log('ZoneForm getDeepItem', deepZoneItem);
          this.setState({ deepZoneItem });
        })
        .catch(error => {
          console.log('fetchDeepDisplaysAndWallsOfZone error', error);
        });
    }
  }

  hideFilter(props) {

    const { actions, editorShowing } = props;
    const { filterActions } = actions;
    const { showFilter } = filterActions;

    if (editorShowing) {
      showFilter(MENU_ITEM_ZONES, false);
    }

  }

  addItem(displayMac, wallName) {

    const { formData, parentZone, actions } = this.props;
    const { zoneActions } = actions;
    const { formDataChanged } = zoneActions;

//    console.log('addItem', displayMac, wallName);

    if (displayMac) {
      formData.displays.push(displayMac);
    } else if (wallName) {
      formData.walls.push(wallName);
    }

    formDataChanged({ ...formData, displays: [...formData.displays], walls: [...formData.walls] });
  }

  removeItem(displayMac, wallName) {
//    console.log('removeItem', displayMac, wallName);
  }

  render() {

    const { formData, actions, isConfig, listObject, selected } = this.props;
    const { deepZoneItem } = this.state;

    const { zoneActions, filterActions } = actions;
    const { formDataChanged, showEditor, onRequestSave } = zoneActions;
    const { showFilter } = filterActions;

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',

      textAlign: 'left',
//      borderWidth: 2,
//      borderColor: 'lightblue',
//      borderStyle: 'solid',
    };

    const controllsStyle = {
      display: 'flex',
      textAlign: 'left',
//      flex: '1 0 100%',
//      width: 400,
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
//      borderWidth: 2,
//      borderColor: 'green',
//      borderStyle: 'solid',
    };

   const editListStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      justifyContent: 'flex-start',
//      alignItems: 'flex-start',

//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid',
//      marginTop: 35,
//      minHeight: 420,
//      position: 'absolute',
//      width: '95%',
      overflow: 'auto',
    };

    return (
      <Panel settings={ { id: this.id, title: 'Editor', onToggleItem: (id) => {
        if (id === this.id) {
          if (!formData.dirty) {
            this.setState({ deepZoneItem: undefined });
            showEditor(false);
          } else {
            confirm('Are you sure?', {
              description: `Would you like to discard the changes you have made to \"${formData.name}\" zone?`,
              confirmLabel: 'Discard',
              abortLabel: 'Cancel'
            }).then(() => {
              this.setState({ deepZoneItem: undefined });
              showEditor(false);
            }).catch(() => {});
          }
        }
      } }}>
        <div style={compStyle}>
          <div style={controllsStyle}>
            <FormControl className="input-sm" style={{ width: '70%' }}
              type="text"
              value={formData && formData.name ? formData.name : ''}
              autoFocus
              placeholder="Zone Name"
              disabled={formData && formData.index > -1}
              onChange={(e) => {
                formDataChanged({ ...formData, name: e.target.value });
              }} />
            <Button className="btn-sm" style={{ width: 60 }} 
              disabled={(formData && !formData.dirty) || (formData && typeof(formData.name) === 'string' && formData.name.length === 0)}
              onClick={() => {
                onRequestSave();
                }}>{formData.id ? 'Update' : 'Create'}
            </Button>
          </div>      
          <div style={editListStyle}>
            <ZoneEditList
              formData={formData}
              addItem={this.addItem}
              removeItem={this.removeItem}
              deepZoneItem={deepZoneItem} 
              isConfig={isConfig}
            />
          </div>
        </div>
      </Panel>
    );	
  }
}

function mapStateToProps(state) {

  const { formData, editorShowing, selected, listObject, breadcrumb } = state.zone;

  return {
    selected,
    listObject,
    editorShowing,
    formData,
    rootZone: breadcrumb.length > 0 ? breadcrumb[0] : undefined
//    parentZone: breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1] : undefined
  };

}

function mapDispatchToProps(dispatch) {
 return {
    actions: {
      zoneActions: bindActionCreators(zoneActions, dispatch),
      filterActions: bindActionCreators(filterActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneForm);


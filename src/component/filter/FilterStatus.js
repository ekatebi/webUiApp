/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl, Grid, Row, Col, DropdownButton, MenuItem }
  from 'react-bootstrap';
import {
  DEVICE_COLOR_GREEN,
  DEVICE_COLOR_YELLOW,
  DEVICE_COLOR_RED
} from '../../constant/app';

class FilterStatus extends Component {

  render() {

    const { settings, filter, filterChanged, statusDirty } = this.props;
    const { id } = settings;

    const compStyle = {
      display: filter && filter.show ? 'flex' : 'none',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 50, 
      marginLeft: 5,
      outline: 'none',
//      backgroundColor: statusDirty ? '#e7c4ff' : '',
      background: statusDirty ? '#e7c4ff' : ''
//      borderColor: statusDirty ? '#e7c4ff' : '',
//      borderWidth: statusDirty ? 2 : 0,
//      borderStyle: statusDirty ? 'solid' : 'none'
    };

    let filterStatus = (<div />);

    if (settings.status && filter) {

      let statusGreen = (<i />);
      let statusYellow = (<i />);
      let statusRed = (<i />);

      if (filter.statusGreen) {
        statusGreen = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      if (filter.statusYellow) {
        statusYellow = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      if (filter.statusRed) {
        statusRed = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      let zyper4k = (<i />);
      let zyperUhd = (<i />);
      let zyperHd = (<i />);

      if (filter.model4k) {
        zyper4k = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      if (filter.modelUhd) {
        zyperUhd = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      if (filter.modelHd) {
        zyperHd = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      let usbYesCheckmark = (<i />);
      let usbNoCheckmark = (<i />);

      if (filter.usbYes) {
        usbYesCheckmark = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

      if (filter.usbNo) {
        usbNoCheckmark = (<i className="fa fa-check" aria-hidden="true"></i>);
      }

    const statusGroupStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'default',
    };

    const statusTopGroupStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      cursor: 'default',
    };

    const statusStyle = (borderStateColor) => {
      return {

        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 10,

        cursor: 'pointer',
        width: 24,
        height: 24,
        marginRight: 10,
        borderWidth: '2px',
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: borderStateColor,
      };
    };

    const modelStyle = (borderStateColor, border = true) => {
      return {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: border ? 'center' : 'flex-start',
        alignItems: 'center',

        cursor: 'pointer',
        width: border ? 24 : 40,
        height: 24,
        marginLeft: border ? 0 : 2,
        borderWidth: '2px',
        borderRadius: 3,
        borderColor: borderStateColor,
        borderStyle: border ? 'solid' : 'none',
      };
    };

    const usbStyle = (borderStateColor, border = true) => {
      return {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center',

        cursor: 'pointer',
        width: 24,
        height: 24,
        margin: border ? '3px 0px 0px 8px' : '3px 8px 0px 0px',
        borderWidth: '2px',
        borderRadius: 3,
        borderColor: borderStateColor,
        borderStyle: border ? 'solid' : 'none',
      };
    };

//    const title = statusDirty ? 'Refine By' : 'Status';
    const title = 'Filter By';

    filterStatus = (
      <DropdownButton className="btn btn-link" bsSize="small" style={compStyle} title={title} pullRight noCaret
        id="split-button-dropdown-status">
        <MenuItem eventKey="1" onClick={(e) => {
            e.stopPropagation();
          }}>
          <span style={statusTopGroupStyle}>
            <span style={statusStyle(DEVICE_COLOR_GREEN)}
              onClick={(e) => {
                filterChanged(id, 'statusGreen');
                e.stopPropagation();
              }}>
              {statusGreen}
            </span>
            <span style={statusStyle(DEVICE_COLOR_YELLOW)}
              onClick={(e) => {
                filterChanged(id, 'statusYellow');
                e.stopPropagation();
              }}>
              {statusYellow}
            </span>
            <span style={statusStyle(DEVICE_COLOR_RED)}
              onClick={(e) => {
                filterChanged(id, 'statusRed');
                e.stopPropagation();
              }}>
              {statusRed}
            </span>
          </span>
        </MenuItem>
        <MenuItem eventKey="2" onClick={(e) => {
            e.stopPropagation();
          }}>
          <span style={statusTopGroupStyle}>
            <span style={statusGroupStyle} onClick={(e) => {
                filterChanged(id, 'usbYes');
                e.stopPropagation();
              }}>
              <span style={modelStyle('lightblue')}>
                {usbYesCheckmark}
              </span><span style={modelStyle('', false)}>USB</span>
            </span>
            <span style={statusGroupStyle} onClick={(e) => {
                filterChanged(id, 'usbNo');
                e.stopPropagation();
              }}>
              <span style={modelStyle('lightblue')}>
                {usbNoCheckmark}
              </span><span style={modelStyle('', false)}>No USB</span>
            </span>
          </span>
        </MenuItem>
        <MenuItem eventKey="3" onClick={(e) => {
            e.stopPropagation();
          }}>
          <span style={statusTopGroupStyle}>
            <span style={statusGroupStyle} onClick={(e) => {
                  filterChanged(id, 'model4k');
                  e.stopPropagation();
                }}>
              <span style={modelStyle('lightblue')}>
                {zyper4k}
              </span><span style={modelStyle('', false)}>4K</span>
            </span>
            <span style={statusGroupStyle} onClick={(e) => {
                  filterChanged(id, 'modelUhd');
                  e.stopPropagation();
                }}>
              <span style={modelStyle('lightblue')}>
                {zyperUhd}
              </span><span style={modelStyle('', false)}>UHD</span>
            </span>
            <span style={statusGroupStyle} onClick={(e) => {
                  filterChanged(id, 'modelHd');
                  e.stopPropagation();
                }}>
              <span style={modelStyle('lightblue')}>
                {zyperHd}
              </span><span style={modelStyle('', false)}>HD</span>
            </span>
          </span>
        </MenuItem>
      </DropdownButton>);
    }

    return filterStatus;
  }

}

function mapStateToProps(state, props) {

  const { id } = props.settings;

  const filter = state.filter[id];

  const statusDirty = props.settings.status && filter && 
    (!filter.statusGreen || !filter.statusYellow || !filter.statusRed ||
    !filter.model4k || !filter.modelUhd || !filter.modelHd ||
    !filter.usbYes || !filter.usbNo);

  return {
    filter,
    statusDirty
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterStatus);

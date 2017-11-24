/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Well, Collapse, form, Button, Checkbox, fieldset,
  ButtonToolbar, ControlLabel, FormControl, Grid, Row, Col }
  from 'react-bootstrap';
import {
  DEVICE_COLOR_GREEN,
  DEVICE_COLOR_YELLOW,
  DEVICE_COLOR_RED
} from '../../constant/app';
import FilterStatus from './FilterStatus';

class Filter extends Component {

  render() {

    const { settings, filter, filterChanged } = this.props;
    const { id } = settings;


    const compStyle = {
      display: filter && filter.show ? 'flex' : 'none',
      flex: '1',
      flexFlow: 'row nowrap',
      borderWidth: 2,
      borderColor: 'purple',
//      borderStyle: 'solid',
    };

    const nameStyle = {
      flexGrow: 1,
      minWidth: 140,
    };

    const filterGridStyle = {
      minWidth: 540,
      maxWidth: 540,
      borderWidth: '1px',
      borderColor: 'purple',
      // borderStyle: 'solid',
    };

    const filterColStyle = {
      padding: '0px 20px 0px 10px',
      borderWidth: '1px',
      borderColor: 'orange',
      // borderStyle: 'solid',
    };

    const statusStyle = (borderStateColor) => {
      return {
        display: 'block',
        cursor: 'pointer',
        width: 24,
        height: 24,
        marginTop: 3,
        borderWidth: '2px',
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: borderStateColor,
      };
    };

    const modelStyle = (borderStateColor, border = true) => {
      return {
        cursor: 'pointer',
        width: 24,
        height: 24,
        margin: border ? '3px 0px 0px 8px' : '3px 0px 0px 2px',
        borderWidth: '2px',
        borderRadius: 3,
        borderColor: borderStateColor,
        borderStyle: border ? 'solid' : 'none',
      };
    };

    const usbStyle = (borderStateColor, border = true) => {
      return {
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

    let status = (<div />);

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

      status = (
        <Grid style={filterGridStyle}>
          <Row>
            <Col xs={3} style={filterColStyle}>
              <Row>
                <Col xs={4} onClick={() => {
                  filterChanged(id, 'statusGreen');
                }}>
                  <span style={statusStyle(DEVICE_COLOR_GREEN)}>
                    {statusGreen}
                  </span>
                </Col>
                <Col xs={4} onClick={() => {
                  filterChanged(id, 'statusYellow');
                }}>
                  <span style={statusStyle(DEVICE_COLOR_YELLOW)}>
                    {statusYellow}
                  </span>
                </Col>
                <Col xs={4} onClick={() => {
                  filterChanged(id, 'statusRed');
                }}>
                  <span style={statusStyle(DEVICE_COLOR_RED)}>
                    {statusRed}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={5} style={filterColStyle}>
              <Row>
                <Col xs={2} onClick={() => {
                  filterChanged(id, 'model4k');
                }}>
                  <span style={modelStyle('lightblue')}>
                    {zyper4k}
                  </span>
                </Col>
                <Col xs={2} onClick={() => {
                  filterChanged(id, 'model4k');
                }}>
                  <span style={modelStyle('', false)}>4K</span>
                </Col>

                <Col xs={2} onClick={() => {
                  filterChanged(id, 'modelUhd');
                }}>
                  <span style={modelStyle('lightblue')}>
                    {zyperUhd}
                  </span>
                </Col>
                <Col xs={2} onClick={() => {
                  filterChanged(id, 'modelUhd');
                }}>
                  <span style={modelStyle('', false)}>UHD</span>
                </Col>

                <Col xs={2} onClick={() => {
                  filterChanged(id, 'modelHd');
                }}>
                  <span style={modelStyle('lightblue')}>
                    {zyperHd}
                  </span>
                </Col>
                <Col xs={2} onClick={() => {
                  filterChanged(id, 'modelHd');
                }}>
                  <span style={modelStyle('', false)}>HD</span>
                </Col>

              </Row>
            </Col>
            <Col xs={4} style={filterColStyle}>
              <Row>
                <Col xs={3} onClick={() => {
                  filterChanged(id, 'usbYes');
                }}>
                  <span style={usbStyle('lightblue')}>
                    {usbYesCheckmark}
                  </span>
                </Col>
                <Col xs={3} onClick={() => {
                  filterChanged(id, 'usbYes');
                }}>
                  <span style={usbStyle('', false)}>USB</span>
                </Col>
                <Col xs={3} onClick={() => {
                  filterChanged(id, 'usbNo');
                }}>
                  <span style={usbStyle('lightblue')}>
                    {usbNoCheckmark}
                  </span>
                </Col>
                <Col xs={3} onClick={() => {
                  filterChanged(id, 'usbNo');
                }}>
                  <span style={usbStyle('', false)}>No&nbsp;USB</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
        );
    }

    let val = '';

    if (filter && filter.name) {
      val = filter.name;
    } 

//      <div className={ filter && filter.show ? 'appFilter slideIn' : 'appFilter slideOut' }>

    return (
      <div style={compStyle}>
        <FormControl
          style={nameStyle}
          className="input-sm"
          type="text"
          value={val}
          autoFocus
          placeholder={settings.filterFor ? settings.filterFor : 'filter for name...'}
          onChange={(e) => {
            filterChanged(id, 'name', e.target.value);
        }}
        />
        {/* status */}
        <FilterStatus settings={this.props.settings} />
      </div>
    );
  }

}

function mapStateToProps(state, props) {

  const { id } = props.settings;

  return {
    filter: state.filter[id]
  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

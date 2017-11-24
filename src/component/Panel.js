/* eslint react/prop-types: 0  no-console: 0 */
import React, { Component, PropTypes } from 'react';
import Pagination from 'react-js-pagination';
import Filter from './filter/Filter';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './filter/actions';
import Loader from 'react-loader';
import { appBackgroundColor, PAGINATION } from '../constant/app';
import ToolTip from './ToolTip';

class Panel extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    size: PropTypes.object
  };

  static defaultProps = {
    size: { minHeight: undefined, maxHeight: 0 },
    style: {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap'
    },
    loaded: true,
    padding: 8
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.spinnerOptions = {
      lines: 11,
      length: 20,
      width: 7,
      radius: 25,
      corners: 1,
      rotate: 0,
      direction: 1,
      color: appBackgroundColor,
      speed: 1,
      trail: 60,
      shadow: true,
      hwaccel: false,
      zIndex: 2e9,
      top: '50%',
      left: '50%',
      scale: 0.70
    };
  }

  render() {

    const { id, title, onToggleItem, filter, pagination } = this.props.settings;
    const { minHeight, maxHeight } = this.props.size;
    const isMenu = id && id.startsWith('APP_MENU__ITEM_');

    const panelHeadingStyle = {
//      display: 'flex',
//      flex: '0 1 auto',
//      flexFlow: 'row nowrap',

//      order: '1'
//      borderWidth: 2,
//      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const titleStyle = {
//      display: 'flex',
//      flex: '20',

      order: '2',
      alignContent: 'flex-start',
      justifyContent: 'center',
      marginLeft: 20,
      marginRight: 20
    };

    const filterStyle = {
      order: '1',
//      display: 'flex',
//      flex: '1',
      alignSelf: 'flex-start',
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      cursor: 'pointer'
    };

    const xStyle = {
      order: '3',
//      display: 'flex',
//      flex: '1',
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      cursor: 'pointer'
    };

    const panelStyle = {
//      overflow: 'auto',
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      height: '100%',
      // padding: 0
    };

    const panelBodyStyle = {
//      overflow: 'auto',
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
      height: '100%',
      // padding: 0
      borderWidth: 2,
      borderColor: 'yellow',
      borderStyle: 'solid'
    };

    const panelFooterStyle = {
//      overflow: 'auto',
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
      // flexBasis: 'fill -moz-available -webkit-fill-available',
//      flexBasis: '-webkit-fill-available',
//      flexBasis: '-moz-available',
//      flexBasis: 'fill',

//      flex: '1 0 auto',
//       height: '100%',
//      maxHeight,

//      flexFlow: 'row wrap',
//      alignContent: 'flex-start',

//      order: '3',
      borderWidth: '2px',
      borderColor: 'lightgreen',
//      borderStyle: 'solid',
    };

    const innerHeight = filter ? 490 : 600;

    const innerStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      alignContent: 'flex-start',
      borderWidth: 2,
      borderColor: 'yellow',
      borderStyle: 'solid'
    };

    const filterCompStyle = {
      display: 'flex',
      flex: '0 1 auto',
      alignContent: 'flex-start',
      borderWidth: 1,
      borderColor: 'lightblue',
//      borderStyle: 'solid',
      marginBottom: 5
    };

    const paginationCompStyle = {
      display: 'flex',
      flex: '0 1 auto',
      justifyContent: 'center',

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid',

      marginTop: -15,
      marginBottom: -10
    };

    let filterDiv = (<div />);


    if (filter) {
      filterDiv = (
          <ToolTip placement="right" 
                tooltip={ `${this.props.filter && this.props.filter.show ? 'Hide' : 'Show'} ${title} Filter` }>
            <span style={filterStyle}
              onClick={
                (e) => {
                  this.props.showFilter(id);
                  e.stopPropagation();
                }
              }
            >
              <i className="fa fa-filter fa-lg" />
            </span>
          </ToolTip>
        );
    }

    const plainHeader = (
        <div className="panel-heading appPanelHeading" style={panelHeadingStyle}>
          {filterDiv}
          <h4 className="panel-title appPanelTitle" style={titleStyle}>
            {title}
          </h4>
            <span style={xStyle}
              onClick={
                (e) => {
                  onToggleItem(id);
                  e.stopPropagation();
                }
              }
            >
              <ToolTip placement="left" 
                    tooltip={ `Close ${title} Panel` }>

                <i className="fa fa-times fa-lg" />
              </ToolTip>
            </span>
        </div>
      );

//    let paginationDiv = (<div style={ { display: 'none' } } />);
    let paginationDiv = (<div />);

    if (pagination && pagination.totalItemsCount > pagination.itemsCountPerPage) {
//      console.log('pagination', pagination);
      paginationDiv = (
        <div style={paginationCompStyle}>
          <Pagination
            activePage={pagination.activePage}
            itemsCountPerPage={pagination.itemsCountPerPage}
            totalItemsCount={pagination.totalItemsCount} 
            pageRangeDisplayed={pagination.pageRangeDisplayed || PAGINATION.pageRangeDisplayed}
            onChange={pagination.handleChange}
          />
        </div>
      );
    }

    const compStyle = {
      WebkitUserSelect: 'none',
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      height: '100%',
      borderWidth: 2,
      borderColor: 'blue',
      borderStyle: 'solid' 
    };

    return (
      <div className="panel panel-default appPanel">
        {plainHeader}
        <div className="panel-body appPanelBody" style={{ padding: this.props.padding }}>
          <div className="appInner">
              <Collapse timeout={500} in={this.props.filter && this.props.filter.show}>
                <div style={filterCompStyle}>
                  <Filter settings={ { ...filter, id } } />
                </div>
              </Collapse>
            <Collapse in={pagination !== undefined}>
              <div>
                {paginationDiv}
              </div>
            </Collapse>
            <Loader loaded={this.props.loaded} options={this.spinnerOptions}>
              {this.props.children}
            </Loader>
          </div>
        </div>
        {/* <div className="panel-footer" style={panelFooterStyle} >Panel Footer</div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Panel);

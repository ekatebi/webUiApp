import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as actions from './actions';

class AddOrEditSecItem extends Component {


	render() {
		const { item, secType, modeAdd, onShowEditor } = this.props;

		const sym = modeAdd ? 'fa fa-plus fa-lg' : 'fa fa-pencil-square-o fa-lg';

   	const compStyle = {
      display: 'flex',
//      flexGrow: 1,
      flex: '1 1 auto',
      flexFlow: 'row wrap',
//      justifyContent: 'flex-end',
//      alignItems: 'center',
      alignItems: 'flex-start',

      borderWidth: '2px',
      borderColor: 'lightgreen',
//      borderStyle: 'solid',
//      marginLeft: 
//      cursor: 'pointer'
      width: '100%'
    };

   const plusSignStyle = {
      marginLeft: 5,
      cursor: 'pointer'
    };

		return (
      <div style={compStyle} >
        <span style={plusSignStyle}
           onClick={() => {
            onShowEditor(secType, true, item);
           }}><i className={sym} aria-hidden="true"></i>
        </span>
      </div>
			);
	}
}

function mapStateToProps(state, props) {

//  console.log('mapStateToProps', props);
  const { id } = props.settings;
  const { [id]: subState } = state.sec;

  return {
    secType: id,
    item: subState.item.data    
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddOrEditSecItem);

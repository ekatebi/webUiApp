import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import SecItem from './SecItem';
// import SecListDropTarget from './SecListDropTarget';

class SecList extends Component {

	render() {

    const { settings, list, secType, onDelete, onShowEditor, filter } = this.props;

    const compStyle = {
      padding: 10,
      display: 'flex',
      flex: '1 1 auto',
      flexFlow: 'column nowrap',

      overflow: 'auto',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid',

      width: '100%',

      minWidth: 300,

//      paddingRight: 4,
//      paddingLeft: 2

    };

    const items = list.map((item, index) => {
      return (
        <SecItem item={{ ...item, secType, index }} key={index} onDelete={onDelete} onShowEditor={onShowEditor} />
        );
    });

    return (
        <div style={compStyle} >
          {items}
        </div>
      );

	}

}

function mapStateToProps(state, props) {

//  console.log('mapStateToProps', props);

  const { id } = props.settings;
  const { [id]: subState } = state.sec;
  const filter = state.filter[id];
  const list = subState.list;

  const items = list
    .filter((sec) => {
      if (filter && filter.show && filter.name) {
        return sec.name.toLowerCase().indexOf(filter.name.toLowerCase()) > -1;
      }        
      return true;
    });

  return {
    secType: id,
//    secTypeName: subState.name,
    fetching: subState.fetching,
    list: items
//    list: subState.list,
//    filter: state.filter[id]
  };

}

function mapDispatchToProps(dispatch) {
 return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SecList);



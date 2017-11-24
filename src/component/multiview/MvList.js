import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import * as mvActions from './actions';
import * as deviceActions from '../device/actions';
import MvItem from './MvItem';
import {
  MENU_ITEM_MULTIVIEW
} from '../appMenu/constants';

class MvList extends Component {

  render() {

    const { list, model, error, filter, mvActions, isConfig } = this.props;
    const { onRequestDeleteItem, showEditor } = mvActions;

//    console.log('list', list);

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
      alignContent: 'flex-start',
      overflow: 'auto',
//      marginTop: 10
/*
      borderWidth: 2,
      borderColor: 'red',
      borderStyle: 'solid',
*/
    };

    let items = [];

    if (list) {
//      items = list.map((item, index) => {
      items = list.filter((item) => {
        if (filter && filter.show && filter.name) {
          return item.gen.name.indexOf(filter.name) > -1;
        }        
        return true;
      })
      .sort((a, b) => {
        const nameA = a.gen.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.gen.name.toUpperCase(); // ignore upper and lowercase
        
        if (nameA < nameB) {
          return -1;
        }
        
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      })
      .map((item, index) => {
        return (
          <MvItem key={index} item={item} model={model[item.gen.name]} index={index}
            pos={item.gen.pos} size={item.gen.size} src={item.gen.src} isConfig={isConfig}
            />
          );
      });
    }

    return (
      <div style={compStyle}>
        {items}
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { list, model, error, fetching, editorShowing } = state.multiview;
  const { encoders } = state.device;

//  console.log('encoders', encoders);


  if (encoders && encoders.status && encoders.status.info && encoders.status.info.text) {
    list.forEach((item) => {

  //    console.log('wall', item.gen.name, item.gen.videoSourceMac);
      
      if (item && item.gen && item.gen.videoSourceMac && 
        item.gen.videoSourceMac !== 'none' && 
        item.gen.videoSourceMac !== '00:00:00:00:00:00') {

  //      console.log('videoSourceMac', item.gen.videoSourceMac);

        const config = encoders.status.info.text.find((config) => {
          return config.gen.mac === item.gen.videoSourceMac;
        });

        if (config) {
          item.gen.videoSourceName = config.gen.name;
        }
   
      }
    });
  }

  return {
    list,
    model,
    error,
    fetching,
    editorShowing,
    filter: state.filter[MENU_ITEM_MULTIVIEW]
  };

}

function mapDispatchToProps(dispatch) {
 return {
      mvActions: bindActionCreators(mvActions, dispatch),
      deviceActions: bindActionCreators(deviceActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MvList);


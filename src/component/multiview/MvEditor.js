import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import * as mvActions from './actions';
import * as filterActions from '../filter/actions';
import Panel from '../Panel';
import MvGrid from './MvGrid';
import MvForm from './MvForm';
import MvWin from './MvWin';
import MvPoint from './MvPoint';
import MvSpareWins from './MvSpareWins';
import MvPatterns from './MvPatterns';
import { confirm } from '../confirm/service/confirm';
import ToolTip from '../ToolTip';
import {
  MENU_ITEM_MULTIVIEW
} from '../appMenu/constants';

class MvEditor extends Component {

  constructor(props) {
    super(props);
    this.closeEditor = this.closeEditor.bind(this);
    this.id = 'MvEditor';
    this.hideFilter = this.hideFilter.bind(this);
  }

  componentWillMount() {
    this.hideFilter(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.hideFilter(nextProps);
  }

  hideFilter(props) {

    const { actions, editorShowing } = props;
    const { filterActions } = actions;
    const { showFilter } = filterActions;

    if (editorShowing) {
      showFilter(MENU_ITEM_MULTIVIEW, false);
    }
  }

  closeEditor(id) {
    const { actions, item } = this.props;
    const { mvActions } = actions;
    const { showEditor } = mvActions;

    if (id === this.id) {
      if (!item || !item.dirty) {
        showEditor(false);
      } else {
        confirm('Are you sure?', {
          description: `Would you like to discard the changes you have made to \"${item.gen.name}\" multiview?`,
          confirmLabel: 'Discard',
          abortLabel: 'Cancel'
        }).then(() => {
          showEditor(false);
        }).catch(() => {});
      }
    }
  }

  render() {

    const { actions, item, maxWins, aspectRatio } = this.props;
    const { mvActions } = actions;
    const { showEditor } = mvActions;

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',

//      borderWidth: 1,
//      borderColor: 'blue',
//      borderStyle: 'solid'
    };

    const innerStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
//      overflow: 'auto',

//      borderWidth: 1,
//      borderColor: 'pink',
//      borderStyle: 'solid'
    };

    const bottomPanelStyle = {
      display: 'flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',

      marginTop: 2,
      borderWidth: 2,
      borderColor: 'pink',
//      borderStyle: 'solid'
    };

//             <MvForm item={item} />
    const aspectRatioStyle = {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',

      width: 110,
      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid',
      fontWeight: aspectRatio ? 'bold' : 'normal',
      textDecoration: aspectRatio ? 'none' : 'line-through',
      cursor: 'pointer'

    };

    let aspectRatioDiv = (<div />);

    if (window.mv) {
      aspectRatioDiv = (
        <div style={aspectRatioStyle}
          onClick={(e) => {
            mvActions.toggleAspectRatio();
            e.stopPropagation();
          } }
        >
          <ToolTip placement={'top'} 
          tooltip={`click to ${aspectRatio ? 'disable' : 'enable'} aspect ratio enforcement`}>
            <span>Aspect Ratio</span>
          </ToolTip>
        </div>
      );
    }

    return (
      <div style={compStyle}>
        <Panel settings={ { id: this.id, title: 'Editor', onToggleItem: this.closeEditor } }>
          <div style={innerStyle}>
            <MvGrid item={item} />
            <div style={bottomPanelStyle}>
              <MvForm />
              <MvSpareWins />
              {aspectRatioDiv}
              <MvPatterns />
            </div>
          </div>
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { item, editorShowing, maxWins, aspectRatio } = state.multiview;

  return {
    maxWins,
    item,
    editorShowing,
    aspectRatio
  };

}

function mapDispatchToProps(dispatch) {
 return {
    actions: {
      mvActions: bindActionCreators(mvActions, dispatch),
      filterActions: bindActionCreators(filterActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MvEditor);


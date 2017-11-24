/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import * as actions from './actions';
import * as wallActions from './actions';
import * as filterActions from '../filter/actions';
import { Well, Collapse, Button, Overlay, Label, Grid, Row, Col }
  from 'react-bootstrap';
import Panel from '../Panel';
import WallMatrix from './WallMatrix';
import WallForm from './WallForm';
import { confirm } from '../confirm/service/confirm';
import {
  MENU_ITEM_WALLS
} from '../appMenu/constants';

class WallEditor extends Component {

  constructor(props) {
    super(props);
    this.closeEditor = this.closeEditor.bind(this);
    this.id = 'WallEditor';
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
      showFilter(MENU_ITEM_WALLS, false);
    }
  }

  closeEditor(id) {
    const { actions, formData } = this.props;
    const { wallActions } = actions;
    const { showEditor } = wallActions;

    if (id === this.id) {
      if (!formData.dirty) {
        showEditor(false);
      } else {
        confirm('Are you sure?', {
          description: `Would you like to discard the changes you have made to \"${formData.name}\" video wall?`,
          confirmLabel: 'Discard',
          abortLabel: 'Cancel'
        }).then(() => {
          showEditor(false);
        }).catch(() => {});
      }
    }
  }

  render() {

    const { actions, formData } = this.props;
    const { wallActions } = actions;
    const { showEditor } = wallActions;

    const compStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid'
    };

    const innerStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'column nowrap',
      overflow: 'auto',

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'
    };

    return (
      <div style={compStyle}>
        <Panel settings={ { id: this.id, title: 'Editor', onToggleItem: this.closeEditor } }>
          <div style={innerStyle}>
            <WallMatrix />
            <WallForm />
          </div>
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { formData, editorShowing } = state.wall;

  return {
    formData,
    editorShowing
  };

}

function mapDispatchToProps(dispatch) {
 return {
    actions: {
      wallActions: bindActionCreators(wallActions, dispatch),
      filterActions: bindActionCreators(filterActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WallEditor);


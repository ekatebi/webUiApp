import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Panel from './Panel';
import Status from './server/Status';
import Config from './server/Config';
import {
  MENU_ITEM_SERVER
} from './appMenu/constants';

class ServerPanel extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { data: null, error: null };
  }

  componentWillMount() {
    const { id } = this.props.settings;
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.settings;
  }

  render() {
    const { isConfig, isAdmin } = this.props;
    const { data } = this.state;
    const { id, title, onToggleItem } = this.props.settings;

    const contentStyle = {
      flex: '1',
      borderWidth: 2,
      borderColor: 'blue',
//      borderStyle: 'solid',

      overflow: 'auto',

      MozUserSelect: 'text',
      WebkitUserSelect: 'text',
      msUserSelect: 'text',
    };

    let content = this.props.settings.data;

    if (!content) {
      const devs = [];
      const servers = [];
      const emptyServer = { data: null };

      // console.log('ServerPanel server:', emptyServer);
      servers.push(
        <Status data={emptyServer} key={0} />
      );
      if (isConfig || isAdmin) {
        servers.push(
          <Config data={emptyServer} key={1} isConfig={isConfig} isAdmin={isAdmin} />
        );
      }
      content = servers;
    }

    return (
      <Panel settings={ { id, title, onToggleItem } }>
        <div style={contentStyle}>
          {content}
        </div>
      </Panel>
    );
  }
}

function mapStateToProps(state, props) {  
  const { settings } = props;
  const { token } = state.auth;

  return {
    isConfig: token && token.role && token.role.perms && 
      token.role.perms[settings.title] && token.role.perms[settings.title].Configure,

    isAdmin: token && token.role && token.role.perms && 
      token.role.perms[settings.title] && token.role.perms[settings.title].Admin

  };
}

export default connect(mapStateToProps)(ServerPanel);

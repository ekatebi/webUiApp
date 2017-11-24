import React, { Component, PropTypes } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { routeActions } from 'react-router-redux';

class Admin extends Component {

  static propTypes = {
    eventKey: PropTypes.number.isRequired,
  };

  pushPath(path, evt) {
    evt.preventDefault();
    window.Store.dispatch(routeActions.push(`/${path}`));
  }

  render() {
    const glyphs = ['flag', 'book', 'king', 'knight', 'globe', 'user'];
    const paths = ['cultures', 'dictionaryentries', 'documentclasses',
                   'documenttypes', 'organizations', 'users'];

    return (
      <NavDropdown eventKey={this.props.eventKey}
        title="Admin" id="collapsible-navbar-dropdown">
        { paths.map((path, i) => (
          <MenuItem key={i}
            eventKey={`${this.props.eventKey}.${i}`}
            active={window.Store.getState().routing.path === `/${paths[i]}`}
            onClick={this.pushPath.bind(this, paths[i])}>
            <span className={`glyphicon glyphicon-${glyphs[i]}`}/>
              &nbsp;&nbsp;{paths[i]}
          </MenuItem>
          ))
        }
      </NavDropdown>
    );
  }
}

export default Admin;

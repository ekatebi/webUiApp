import React, { Component, PropTypes } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { themeKey } from '../constant/app';

class Themes extends Component {

  static propTypes = {
    eventKey: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.themes = [
      'cerulean',
      'cosmo',
      'cyborg',
      'darkly',
      'flatly',
      // 'journal',
      // 'lumen',
      // 'paper',
      'readable',
      'sandstone',
      'simplex',
      // 'slate',
      'spacelab',
      // 'superhero',
      'united',
      // 'yeti',
    ];
    let theme = window.localStorage.getItem(themeKey);
    if (this.themes.indexOf(theme) === -1) {
      theme = this.themes[0];
    }
    this.selectedIndex = this.themes.indexOf(theme);
    require(`../style/theme/${theme}.less`);
  }

  select(evt, ekey) {
    evt.preventDefault();
    const key = ekey.split('.')[1];
    const theme = this.themes[key];
    // console.log('THEME:', theme);
    window.localStorage.setItem(themeKey, theme);
    location.reload();
  }

  render() {
    const cog = <span className="glyphicon glyphicon-cog" />;
    return (      
      <NavDropdown eventKey={this.props.eventKey}
        title={cog} id="collapsible-navbar-dropdown">
      {this.themes.map((theme, index) =>
        <MenuItem onSelect={this.select} key={index}
          active={ index === this.selectedIndex }
          eventKey={`${this.props.eventKey}.${index}`}>
        { `${theme.charAt(0).toUpperCase()}${theme.slice(1)}` }
        </MenuItem>)
      }
      </NavDropdown>
    );
  }
}

export default Themes;

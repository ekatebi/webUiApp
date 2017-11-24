import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { TIME_FORMAT } from './constants';
import ToolTip from '../ToolTip';
import * as epgActionsEx from './actions';
import { appLightBackgroundColor, appMidBackgroundColor } from '../../constant/app';

export default class EpgProg extends Component {

	render() {

		const { onExit } = this.props;
		const { title, subTitle, desc, icon, rating, category, credits } = this.props.prog;

		const compStyle = {
			display: 'inline-flex',
      flex: '1 0 auto',
      flexFlow: 'row nowrap',			

      width: icon ? 400 : 200,
      height: desc || icon ? 200 : 100,

      borderWidth: 2,
      borderColor: 'white',
//      borderStyle: 'solid'      
		};

		const iconStyle = {
			display: 'inline-flex',
      flex: '1',
      flexFlow: 'column nowrap',

      justifyContent: 'center',
      alignItems: 'center',

//      overflow: 'auto',

      padding: 5,

//      width: 200,
//      height: 200,

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'      
		};

		const leftSideStyle = {
			display: icon ? 'inline-flex' : 'none',
      flex: '2',
      flexFlow: 'column nowrap',

      justifyContent: 'center',
      alignItems: 'center',

      overflow: 'hidden',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid'      
		};

		const rightSideStyle = {
			display: 'inline-flex',
      flex: '3',
      flexFlow: 'column nowrap',

      justifyContent: 'flex-end',
      alignItems: 'flex-end',

      overflow: 'hidden',

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'      
		};

		const textStyle = {
			display: 'inline-flex',
      flex: '1',
      flexFlow: 'column nowrap',

      justifyContent: 'flex-start',
      alignItems: 'center',

      paddingBottom: 5,
      width: '100%',

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid'      
		};

		const descStyle = {
			display: desc ? 'inline-flex' : 'none',
      flex: '1',
      flexFlow: 'column nowrap',

      justifyContent: 'flex-start',
      alignItems: 'flex-start',

      overflow: 'auto',

      paddingLeft: 10,

			width: '100%',
			height: '100%',

      borderWidth: 2,
      borderColor: 'red',
//      borderStyle: 'solid'      
		};

		const xStyle = {
			display: 'inline-flex',
      flex: '0 0 auto',
      flexFlow: 'row nowrap',

      justifyContent: 'flex-end',
			alignSelf: 'felx-end',

      padding: 5,

      cursor: 'pointer',

      borderWidth: 2,
      borderColor: 'yellow',
//      borderStyle: 'solid'      
		};

		let actorsDiv;
		let directorDiv;

		if (credits && credits[0] && (credits[0].actor || credits[0].director)) {
			const actors = credits && credits[0] && credits[0].actor ? credits[0].actor.join(', ') : undefined; 
			const actorsLabel = credits && credits[0] && credits[0].actor && credits[0].actor.length > 1 ? 'Actors' : 'Actor';

			const directors = credits && credits[0] && credits[0].director ? credits[0].director.join(', ') : undefined;
			const directorsLabel = credits && credits[0] && credits[0].director && credits[0].director.length > 1 ?
				'Directors' : 'Director';

			actorsDiv = actors ? (<p>{`${actorsLabel}: ${actors}`}</p>) : undefined;
			directorDiv = directors ? (<p>{`${directorsLabel}: ${directors}`}</p>) : undefined;
		}

		return (
			<div style={compStyle}>
				<div style={leftSideStyle}>
	        <img src={icon} alt={title} style={{ height: '90%', width: '90%', objectFit: 'contain', overflow: 'auto' }}
	            className="nonDraggableImage" />
				</div>
				<div style={rightSideStyle}>
					<div style={xStyle}>
						<span onClick={onExit}>
							<i className="fa fa-times fa-lg" />
						</span>
					</div>
					<div style={textStyle}>
						<h style={{ textAlign: 'center' }}>{title}</h>
						<h style={{ textAlign: 'center' }}>{subTitle}</h>
						<p>{`${category} - ${rating}`}</p>
						<div style={descStyle}>
							<p>{desc}</p>
							{actorsDiv}
							{directorDiv}
						</div>
					</div>
				</div>
			</div>
			);
	}
}
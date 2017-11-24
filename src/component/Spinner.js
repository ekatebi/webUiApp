import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { Alert, Button } from 'react-bootstrap';

const Spinner = (props) => {
  const { fetching, message, url, mocked,
    onSpinResetWarning, onSpinResetError } = props;
  const options = {
    lines: 13,
    length: 20,
    width: 10,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: 'gray',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    top: '50%',
    left: '50%',
    scale: 1.00
  };
  // console.log('>>>> Spinner:', JSON.stringify(errorMessage, 0, 3));
  const errorAlert = (
  <Alert bsStyle="danger">
   <div className="row">
      <div className="col-sm-9">
        <h6>Errored URLs</h6>
      </div>
      <div className="col-sm-3">
        { !localStorage.mockFetch &&
          <Button onClick={ () => { localStorage.mockFetch = true; } }>
          MockFetch
        </Button> }
        {' '}
        <Button onClick={ onSpinResetError }>Close</Button>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <ul>
          { Object.keys(message).map((url, i) =>
            <li key={i}>{`${url} ==>> ${message[url]}`}</li>) }
        </ul>
      </div>
    </div>
  </Alert>
    );
  // console.log('#### mocked', mocked);
  // console.log('#### url', url);
  const length = (mocked.length + 1) / 2;
  const mockAlert = (
    <Alert bsStyle="warning">
      <div className="col-sm-11">
        <h6>Mocked URLs</h6>
      </div>
      <div className="col-sm-1">
        <Button onClick={ onSpinResetWarning }>Close</Button>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <ul>
            { mocked.slice(0, length).map((url, i) => <li key={i}>{url}</li>) }
          </ul>
        </div>
        <div className="col-sm-6">
          <ul>
            { mocked.slice(length).map((url, i) => <li key={i}>{url}</li>) }
          </ul>
        </div>
      </div>
    </Alert>
  );
  return (
    <Loader loaded={!fetching} {...options} >
      {Object.keys(message).length > 0 && errorAlert}
      {!Object.keys(message).length && mocked.length > 0 &&
        localStorage.mockAlert && mockAlert}
      </Loader>
    );
};


Spinner.propTypes = {
  message: PropTypes.object.isRequired,
  fetching: PropTypes.number.isRequired,
  url: PropTypes.array.isRequired,
  mocked: PropTypes.array.isRequired,
  onSpinResetWarning: PropTypes.func.isRequired,
  onSpinResetError: PropTypes.func.isRequired,
};


export default Spinner;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from '../component/Spinner';
import { onSpinResetWarning, onSpinResetError } from '../action/spinner';

function mapStateToProps(state) {
  const { fetching, message, mocked, url } = state.spinner;
  return {
    fetching,
    message,
    mocked,
    url,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ onSpinResetWarning, onSpinResetError }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Spinner);

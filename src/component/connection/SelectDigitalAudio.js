import React, { Component, PropTypes } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
// import * as actions from './actions';
import { VideoTypes, DigitalAudioTypes, AnalogAudioTypes,
  Rs232Types, IrTypes, UsbTypes, ControlTypes }
  from './connectionTypes';

export default class SelectDigitalAudio extends Component {

  constructor(props) {
    super(props);
    this.selectChanged = this.selectChanged.bind(this);
//    this.updateState = this.updateState.bind(this);
    this.state = { dirty: false };
  }

componentWillReceiveProps(nextProps) {
  const { dirty } = this.state;
  const { connectionFormDataChanged, connectionData, settings } = nextProps;
  const { model } = settings.gen;
  const { formData } = connectionData;
  const xFormData = this.props.connectionData.formData;

  if (!formData || !xFormData) {
    const options = DigitalAudioTypes;
    const option = options[0]; // No Change
    this.setState({ options, option });
    return;
  }

  const options = DigitalAudioTypes.map((option) => {

    if ((formData.video.value === 'fast-switched' ||
      formData.video.value === 'none') &&
      option.value === 'hdmi') {
      return { ...option, disabled: true };
    }

    return option;

  });

  let option = formData.digitalAudio;

  if (option.value === 'noChange') {
    if ((xFormData && xFormData.video.value === 'noChange') || !dirty) {
      if (formData.video.value === 'genlocked') {
        option = options[1]; // hdmi
        connectionFormDataChanged(model, { ...formData, digitalAudio: option });
      } else if (formData.video.value === 'fast-switched') {
        option = options[2]; // hdmiDownmix
        connectionFormDataChanged(model, { ...formData, digitalAudio: option });
      }
    }
  }

  this.setState({ options, option });

}

selectChanged(sel) {
  const { connectionData, connectionFormDataChanged, settings } = this.props;
  const { model } = settings.gen;
  const { formData } = connectionData;
  const newFormData = { ...formData, digitalAudio: sel, dirty: true };
  connectionFormDataChanged(model, newFormData);
  this.setState({ dirty: true });
}

render() {
    const { option, options } = this.state;

    const name = 'digitalAudio';

    return (
      <Select
        name={name}
        value={option}
        options={options}
        searchable={false}
        clearable={false}
        onChange={(sel) => { this.selectChanged(sel); }}
        />

      );
  }
}

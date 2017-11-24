import { VideoTypes, DigitalAudioTypes, AnalogAudioTypes,
  Rs232Types, IrTypes, UsbTypes, ControlTypes }
  from './connectionTypes';

// Default models.
export const defaultModels = {
  Zyper4K: {
    defaultIndex: 0,
    list: [
      {
        video: VideoTypes[1],
        digitalAudio: DigitalAudioTypes[2],
        analogAudio: AnalogAudioTypes[1],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Fast Switched' },
        index: -1,
        defaultConnection: true,
        readOnly: false
      },
      {
        video: VideoTypes[2],
        digitalAudio: DigitalAudioTypes[1],
        analogAudio: AnalogAudioTypes[1],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Genlocked' },
        index: -1,
        defaultConnection: false,
        readOnly: false
      },
      {
        video: VideoTypes[0],
        digitalAudio: DigitalAudioTypes[0],
        analogAudio: AnalogAudioTypes[0],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[1],
        name: { label: 'Name', value: 'USB' },
        index: -1,
        defaultConnection: false,
        readOnly: false
      },
      {
        video: VideoTypes[3],
        digitalAudio: DigitalAudioTypes[4],
        analogAudio: AnalogAudioTypes[3],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Disconnect AV' },
        index: -1,
        defaultConnection: false,
        readOnly: false
      }
    ]
  },

  ZyperUHD: {
    defaultIndex: 0,
    list: [
      {
        video: VideoTypes[1],
        digitalAudio: DigitalAudioTypes[0],
        analogAudio: AnalogAudioTypes[0],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Fast Switched' },
        index: -1,
        defaultConnection: true,
        readOnly: false
      },
      {
        video: VideoTypes[3],
        digitalAudio: DigitalAudioTypes[0],
        analogAudio: AnalogAudioTypes[0],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Disconnect AV' },
        index: -1,
        defaultConnection: false,
        readOnly: false
      }
    ]
  },

  ZyperHD: {
    defaultIndex: 0,
    list: [
      {
        video: VideoTypes[1],
        digitalAudio: DigitalAudioTypes[0],
        analogAudio: AnalogAudioTypes[0],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Fast Switched' },
        index: -1,
        defaultConnection: true,
        readOnly: false
      },
      {
        video: VideoTypes[3],
        digitalAudio: DigitalAudioTypes[0],
        analogAudio: AnalogAudioTypes[0],
        rs232: Rs232Types[0],
        ir: IrTypes[0],
        usb: UsbTypes[0],
        name: { label: 'Name', value: 'Disconnect AV' },
        index: -1,
        defaultConnection: false,
        readOnly: false
      },
    ]
  }
};

export const disconnectAll = {
      video: VideoTypes[3],
      digitalAudio: DigitalAudioTypes[4],
      analogAudio: AnalogAudioTypes[3],
      rs232: Rs232Types[2],
      ir: IrTypes[2],
      usb: UsbTypes[2]
};

export const appName = 'Maestro Z';
export const appVersion = 1.6;
export const appStorageKey = 'Maestro-Z';
export const appBackgroundColor = '#4f2684';
export const appLightBackgroundColor = '#e7c9fc';
export const appMidBackgroundColor = '#d19bf7';
export const itemBackgroundColor = '#f1f1f1';
// pagination params:
export const PAGINATION = {
  itemsCountPerPage: 25,
  pageRangeDisplayed: 5
};

const secPort = !SEC_PORT ? 8080 : Number(SEC_PORT);
export const secDbNative = `http://${window.location.hostname}:${secPort}/sec`;
export const secDbNatives = `https://${window.location.hostname}:${secPort + 1}/sec`;

export const HeartbeatInterval = 5000;
export const FetchLongDelay = 5000;

// export const MAX_COUNT = 25;
// For the development environment only, hardcode the IP address.

// example: $ BACKEND_IP=172.16.5.250 SEC_PORT=8082 yarn start
const backEndHostIp = !BACKEND_IP ? '172.16.200.199' : BACKEND_IP;
// const backEndHostIp = '172.16.200.193';
export const backEndHost =
  NODE_ENV === 'development' ? backEndHostIp : window.location.hostname;
export const backEndPort = 52395;
export const backEndVersion = 'api/v1';
export const serverHost = `http://${backEndHost}:${backEndPort}`;
export const serverPath = `http://${backEndHost}:${backEndPort}/${backEndVersion}`;
export const signInTokenKey = 'signInTokenKey';
export const themeKey = 'themeKey';
// export const link = (url, id) => `${serverPath}/${url}${id ? `/${id}` : '}';
export const menuKey = 'menuKey';
export const URL = `http://${backEndHost}/rcCmd.php`;
export const URL_DB = `http://${backEndHost}/maestroz/backend/data_api.php`;
export const URL_STORE = `http://${backEndHost}/maestroz/backend/store_api.php`;
export const URL_LONG = `http://${backEndHost}/rcLong.php`;
export const URL_UPDATE_SERVER = `http://${backEndHost}/updateServer.php`;
export const URL_UPDATE_DEVICE = `http://${backEndHost}/updateDevice.php`;

// API Commands
export const GET = 'get';
export const SET = 'set';
export const JOIN = 'join';
export const CONNECT = 'connect';
export const NONE = 'none';
export const NO_CHANGE = 'noChange';
export const ACTION = 'action';
// API Sub commands
export const STATUS = 'status';
export const CONFIG = 'config';
export const REDUNDANCY = 'redundancy';
export const EDID = 'edid';
export const IGMP = 'igmp';
export const LICENSE = 'license';
export const PREFERRED = 'preferred';
export const CAPABILITIES = 'capabilities';
export const WALL = 'video-walls';
export const MODE = 'mode';
export const RESTART = 'restart';
export const REBOOT = 'reboot';
export const SHUTDOWN = 'shutdown';
export const TROUBLE = 'trouble';
export const SWITCHOVER = 'switchover';
export const DELETE = 'delete';
export const HDMI = 'hdmi';
export const HDMI_DOWNMIX = 'hdmiDownmix';
export const ANALOG = 'analog';
export const USB = 'usb';
export const IR = 'ir';
export const RS232 = 'rs232';
export const VIDEO_PORT = 'videoPort';
export const IP = 'ip';
export const DHCP = 'dhcp';
export const STATIC = 'static';
export const LINK_LOCAL = 'link-local';
export const GENLOCKED = 'genlocked';
export const FAST_SWITCHED = 'fast-switched';
export const NAME = 'name';
export const MANUFACTURER = 'manufacturer';
export const MODEL = 'model';
export const SERIAL_NUMBER = 'serialNumber';
export const LOCATION = 'location';
// Parts used to build API commands
export const COMMAND_SEPARATOR = '\n';

// Colors
export const DEVICE_COLOR_GREEN = '#00ff00'; 
export const DEVICE_COLOR_YELLOW = '#ffff00';
export const DEVICE_COLOR_RED = '#ff0000';

const path = 'src/images/';

export const iconsObj = {
    cbs: `${path}cbs.png`,
    nbc: `${path}nbc.png`,
    abc: `${path}abc.jpg`,
    fox: `${path}fox.png`,
    foxSports: `${path}foxSports.png`,
    espn: `${path}espn.png`,
    nflNetwork: `${path}nflNetwork.jpg`,
    golf: `${path}golf.png`,
    tennis: `${path}tennis.png`,
    cnn: `${path}cnn.jpg`,
    xbox: `${path}xbox.png`,
    ps3: `${path}ps3.png`,
    BluRay: `${path}BlueRay.png`,
    BroadcastCamera: `${path}BroadcastCamera.png`,
    CableBox: `${path}CableBox.png`,
    DesktopPC: `${path}DesktopPC.png`,
    DVD: `${path}DVD.png`,
    Laptop: `${path}Laptop.png`,
    MediaPlayer: `${path}MediaPlayer.png`,
    VCR: `${path}VCR.png`,
    SatelliteReceiver: `${path}SatelliteReceiver.png`,
    SecurityCamera: `${path}SecurityCamera.png`,
  };

export const decoderIconsObj = {
    FlatPanelDisplay: `${path}FlatPanelDisplay.png`,
    Projector: `${path}Projector.png`,
  };


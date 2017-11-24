import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Panel from './Panel';
import {
  MENU_ITEM_HELP
} from './appMenu/constants';

export default class HelpPanel extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { id } = this.props.settings;
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.settings;
  }

  render() {
    const { id, title, onToggleItem } = this.props.settings;

    const helpStyle = {

      flex: '1',
      flexFlow: 'column nowrap',
      overflow: 'auto',

      textAlign: 'left',
      borderWidth: 2,
      borderColor: 'blue',
//      borderStyle: 'solid',
//      position: 'relative',
      MozUserSelect: 'text',
      WebkitUserSelect: 'text',
      msUserSelect: 'text'
    };

    const tocStyle = {
      border: '1px solid #aaaaaa',
      backgroundColor: '#f9f9f9',
      color: '#0645ad',
      display: 'table',
      padding: '0px 13px 0px 0px',
    };

    const tocTitleStyle = {
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '13px 0px 0px 0px',
    };

    const tocUlStyle = {
      listStyleType: 'none',
    };

    const tocAStyle = {
      color: '#0645ad',
    };

    const h1Style = {
      fontSize: '1.5em',
      color: '#000000',
      fontFamily: 'serif',
      margin: '1em 1em 0.25em 0px',
      borderBottom: '1px solid #aaaaaa',
    };

    const h2Style = {
      fontSize: '1.2em',
      color: '#000000',
      fontWeight: 'bold',
      margin: '1em 1em 0.25em 0px',
    };

    const externalLinkStyle = {
      color: '#0645ad',
    };

    const nav = (ref) => {
      const itemComponent = this.refs[ref];
      if (itemComponent) {
        const domNode = findDOMNode(itemComponent);
        domNode.scrollIntoView(false);
      }
    };

    const liStyle = {
      height: 40
    };

    const specialStyle = {
      color: '#ff0000',
    };

    const indentStyle = {
      paddingLeft: '30px',
    };

    const underlineStyle = {
      textDecoration: 'underline',
    };

    return (
      <Panel settings={ { id, title, onToggleItem } }>
        <div style={helpStyle} ref="helpDiv">
          <div style={tocStyle}>
            <div style={tocTitleStyle}>
              Contents
            </div>
            <ul style={tocUlStyle}>
              <li>
                <a style={tocAStyle} onClick={() => nav('_1.0_Sources')}>1 Sources</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_2.0_Displays')}>2 Displays</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_3.0_Join_Configurations')}>3 Join Configurations</a>
                <ul style={tocUlStyle}>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.1_What_are')}>3.1 What are Join Configurations</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.2_Predefined_Join')}>3.2 Pre-defined Join Configurations</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.3_How_are')}>3.3 How are they used</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.4_Creating_a')}>3.4 Creating a new Join Configuration</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.5_Modify_a')}>3.5 Modify a Join Configuration</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.6_Delete_Join')}>3.6 Delete Join Configuration</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.7_Fast_Switched')}>3.7 Fast Switched vs. Genlocked</a>
                  </li>
                  <li>
                    <a style={tocAStyle} onClick={() => nav('_3.8_Resetting_default')}>3.8 Resetting default configurations</a>
                  </li>
                </ul>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_4.0_Video_Walls')}>4 Video Walls</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_5.0_Multiview')}>5 Multiview</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_6.0_Zones')}>6 Zones</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_7.0_Server')}>7 Server</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_8.0_Logs')}>8 Logs</a>
              </li>
              <li>
                <a style={tocAStyle} onClick={() => nav('_9.0_How_to')}>9 How To&hellip;</a>
              </li>
            </ul>
          </div>

          <h1 style={h1Style} ref="_1.0_Sources">1 Sources</h1>
          <p>This panel will list all the Sources on the ZyPer network as well as its status.</p>
          <p>Each Source is represented by an icon in the panel. That icon includes a default image, the MAC address, or the name (once defined) of the ZyPer Encoder and a color-coded status indicator.</p>
          <p>ZyPer4K, ZyPerUHD, and ZyPerHD Encoders will automatically be discovered and added to the Sources panel. Each Source thumbnail will be identified by a "4K", "UHD", or "HD" in the upper left-hand corner, signifying the different hardware.</p>
          <h2 style={h2Style}>1.1 Filter</h2>
          <p>Use filters to narrow the number of Sources shown in the panel. Click on the funnel shaped icon at the top of the panel to open the filter options. Click on the &ldquo;Filter By&rdquo; button to show all filter options. Filters can be applied on product, hardware options and by status. <em>See &ldquo;Status Colors&rdquo; for more information.</em></p>
          <p>By removing the checkmark from the appropriate box, matching Sources will be hidden from view. When a checkmark filter is applied the Filter By button will be shaded in purple.</p>
          <p>Sources can be filtered based on the name just by entering text in the "Filter by" box. To find a specific Sources without scrolling through all of them, start typing the name. Removing all text will eliminate the text filter.</p>
          <h2 style={h2Style}>1.2 Status Colors</h2>
          <p>What do the status indicator colors mean?</p>
          <ul>
          <li>Green - Connected to the network and an active video source is detected</li>
          <li>Yellow - Connected to the network but no active video source is detected</li>
          <li>Red - Not connected to the network or the ZyPer device is powered off</li>
          </ul>
          <h2 style={h2Style}>1.3 Device Details</h2>
          <p>Click on the Source name to go to the device details to view and configure device details. All changes in the device details are saved automatically.</p>
          <p>Spaces and special characters are not allowed in text fields. Invalid names will be indicated by a red x in the field.</p>
          <p><strong>Summary</strong></p>
          <ul>
          <li>Name of the ZyPer Encoder. The default name is MAC address but this can be changed to a friendly name. Spaces and special characters are not supported in device names</li>
          <li>Whether the Encoder is powered up and connected to the network</li>
          <li>HDMI cable connection status</li>
          </ul>
          <p><strong>ID</strong></p>
          <ul>
          <li>Name of the ZyPer Encoder. By default, the name of the Encoder will by the MAC address. Spaces and special characters are not allowed in text fields. Invalid names will be indicated by a red x in the field.</li>
          <li>The MAC or hardware address of the ZyPer Encoder. This field cannot be edited.</li>
          <li>Text fields - user-provided information about the Source device connected to the ZyPer Encoder.</li>
          </ul>
          <p><strong>Status</strong></p>
          <ul>
          <li>ZyPer Encoder state (up or down), HDMI &amp; HDCP detection status.</li>
          <li>Resolution and refresh rate of the connected source.</li>
          <li>Multicast addresses for outbound video and audio streams.</li>
          <li>Firmware version installed on the ZyPer Encoder.</li>
          </ul>
          <p><strong>Config</strong></p>
          <ul>
          <li>IP Settings of the ZyPer Encoder
          <ul>
          <li>ZyPer4K Encoders are configured for DHCP by default</li>
          <li>ZyPerUHD Encoders are configured for Link-Local address, this cannot be changed</li>
          <li>ZyPerHD Encoders are configured for Link-Local address, this cannot be changed</li>
          </ul>
          </li>
          <li>RS232 communication settings</li>
          <li>Video port selection (on select devices)</li>
          <ul>
          <li>ZyPer4K HDMI 2.0 Encoders may include an optional second input port</li>
          <li>Select active input from the drop-down menu</li>
          <li>Option between HDMI and HDSDI, HDMI and DisplayPort or HDMI and analog input (component, composite, VGA, S-Video)</li>
          </ul>
          <li>Source Icon settings</li>
          </ul>
          <p><strong>Actions</strong></p>
          <ul>
          <li>Reboot the Encoder</li>
          <li>Reset the Encoder back to factory settings - all customizations will be lost (ZyPerUHD &amp; ZyPerHD only)</li>
          <li>Delete - Maestro Z keeps information on devices which have been temporarily removed from the network or powered down. If a device will not be reconnected, then it must be deleted from Maestro Z.</li>
          <li>Update device firmware - Please refer to section 10.2 of this help file for firmware update steps.</li>
          </ul>
          <h2 style={h2Style}>1.4 Sort Order</h2>
          <p>MaestroZ will automatically organize Source thumbnails from left to right,&nbsp;first numerical and then alphabetical order.&nbsp; The sort will wrap back to the left side of the panel, one row down.&nbsp; To create a custom sort order, drag and drop a Source onto another Source thumbnail.&nbsp; For example, to move a Source to the end, drag and drop the Source on top of the last Source thumbnail.&nbsp; The dropped Source will appear in the last position, with all other displays shifted to the left.</p>
          <p>To return to the default sort order, right-click on a blank area of the Source thumbnail.&nbsp; Right-click and select Clear Sort Order.</p>
          <h1 style={h1Style} ref="_2.0_Displays">2 Displays</h1>
          <p>This panel will list all the Displays on the ZyPer network as well as its status and the Sources that it is linked to.</p>
          <p>Each Display will be represented by an icon in this section. That icon includes a default image, the MAC address, or the name (once defined) of the ZyPer Decoder, color-coded status indicator, it is linked to.</p>
          <p>ZyPer4K, ZyPerUHD, and ZyPerHD Decoders will automatically be discovered and added to the Display panel. Each Display thumbnail will be identified by a "4K", "UHD", or "HD" in the upper left-hand corner, signifying the different hardware.</p>
          <h2 style={h2Style}>2.1 Filter</h2>
          <p>Use filters to narrow the number of Displays shown in the panel. Click on the funnel shaped icon at the top of the panel to open the filter options. Click on the &ldquo;Filter By&rdquo; button to show all filter options. Filters can be applied on product, hardware options and by status. <em>See &ldquo;Status Colors&rdquo; for more information.</em></p>
          <p>By removing the checkmark from the appropriate box, matching Displays will be hidden from view in the panel. When a checkmark filter is applied, the Filter By button will be shaded in purple.</p>
          <p>Displays can be filtered based on the name just by entering text in the "Filter by" box. To find a specific Display without scrolling through all of them, start typing the name. Removing all text will eliminate the text filter.</p>
          <h2 style={h2Style}>2.2 Join indications</h2>
          <p>There are several indications that a Source has been Joined with a Display.</p>
          <ul>
          <li>A "link" icon with a number below, indicating how many Join have been made.</li>
          <li>The name of the Source will appear at the top of the Display thumbnail.</li>
          <li>When video is Joined, the Display thumbnail icon will change to that of the Joined Source.</li>
          <li>Hover the cursor over the link icon and a popup window will list all the Sources that are currently Joined to the display.</li>
          <li>This is not an indication that video or audio is flowing, only that the Join has been established.</li>
          <li>USB, IR and RS232 Join Configurations are included in the below the link icon.</li>
          <li>Joins can only be established between devices of the same product group, ZyPer4K, ZyPerUHD, or ZyPerHD.&nbsp; For example, ZyPer4K devices cannot be joined with ZyPerUHD or ZyPerHD devices.</li>
          </ul>
          <h2 style={h2Style}>2.3 Status Colors</h2>
          <p>What do the status indicator colors mean?</p>
          <ul>
          <li>Green - Connected to the network and an active video source is detected</li>
          <li>Yellow - Connected to the network but no active video source is detected or HDMI cable is not connected a display monitor.</li>
          <li>Red - Not connected to the network or the ZyPer device is powered off</li>
          </ul>
          <h2 style={h2Style}>2.4 Device Details</h2>
          <p>Click on the Display name to go to the device details to view and configure device details. All changes in the device details are saved automatically.</p>
          <p>Spaces and special characters are not allowed in text fields. Invalid names will be indicated by a red x in the field.</p>
          <p><strong>Summary</strong></p>
          <ul>
          <li>Name of the ZyPer Decoder. The default name is MAC address but this can be changed to a friendly name. Spaces and special characters are not supported in device names</li>
          <li>Whether the Decoder is powered up and connected to the network</li>
          <li>Name of connected Source and whether video and audio is detected</li>
          <li>HDMI cable connection status</li>
          </ul>
          <p><strong>Connections</strong></p>
          <ul>
          <li>Video Source joined to this Display and connection type, Fast-switched or Genlocked. Genlocked is only supported on ZyPer4K.</li>
          <li>Audio Source</li>
          <li>IR, RS232, and USB join connections (depending on hardware)</li>
          </ul>
          <p><strong>ID</strong></p>
          <ul>
          <li>Name of the ZyPer Decoder. By default, the name of the Decoder will by the MAC address. Spaces and special characters are not allowed in text fields. Invalid names will be indicated by a red x in the field</li>
          <li>The MAC or hardware address of the ZyPer Decoder. This field cannot be edited</li>
          <li>Text fields - user-provided information about the Display device connected to the ZyPer Decoder</li>
          </ul>
          <p><strong>Status</strong></p>
          <ul>
          <li>ZyPer Decoder state (up or down), HDMI &amp; HDCP detection status</li>
          <li>Resolution and refresh rate out to the display</li>
          <li>Firmware version installed on the ZyPer Decoder</li>
          </ul>
          <p><strong>Config</strong></p>
          <ul>
          <li>IP Settings of the ZyPer Decoder.
          <ul>
          <li>ZyPer4K Decoders are configured for DHCP by default.</li>
          <li>ZyPerUHD Decoders are configured for Link-Local address, this cannot be changed.</li>
          <li>ZyPerHD Decoders are configured for a Link-Local address. This cannot be changed.</li>
          </ul>
          </li>
          <li>RS232 communication settings</li>
          <li>Display Icon settings</li>
          </ul>
          <p><strong>Actions</strong></p>
          <ul>
          <li>Reboot the Decoder</li>
          <li>Reset the Decoder back to factory settings - All customizations will be lost</li>
          <li>Delete - Maestro Z keeps information on devices which have been temporarily removed from the network or powered down. If a device will not be reconnected, then it must be deleted from Maestro Z.</li>
          <li>Update device firmware - Please refer to section 10.2 of this help file for firmware update steps.</li>
          </ul>
          <h2 style={h2Style}>2.5 Sort Order</h2>
          <p>MaestroZ will automatically organize Display thumbnails from left to right, first numerical and then alphabetical order.&nbsp; The sort will then wrap back to the left side of the panel, one row down.&nbsp; To create a custom sort order, drag and drop a Display onto another Display thumbnail.&nbsp; For example, to move a Display to the very end, drag and drop a Display on top of the last Display thumbnail.&nbsp; The dragged Display will now appear in the last position, with all other displays shifted to the left.</p>
          <p>To return to the default sort order, right-click on a blank area of the Display thumbnail.&nbsp; Right-click and select Clear Sort Order.</p>
          <h1 style={h1Style} ref="_3.0_Join_Configurations">3 Join Configurations</h1>
          <h2 style={h2Style} ref="_3.1_What_are">3.1 What are Join Configurations?</h2>
          <p>Join Configurations are a set of commands that make and break connections between Sources and Displays. Join Configurations may include video, audio, RS232 connections, IR connections and USB connections. Joins can only be established between ZyPer4K devices, between ZyPerUHD devices or between ZyPerHD devices.&nbsp; Devices from different product groups cannot be joined to one another.</p>
          <p>The default Join Configuration can be set by clicking the radio button in the appropriate box and there can only be one default Join Configuration at a time. A single-click on a Source icon will select the Source, turning the thumbnail grey.&nbsp;The default Join Configuration will be processed by selecting a Source by clicking on the icon,&nbsp; then click on the Display, Video Wall or Zone.</p>
          <h2 style={h2Style} ref="_3.2_Predefined_Join">3.2 Pre-defined Join Configurations</h2>
          <p>Maestro Z includes some pre-defined join configurations that are specific the hardware version being managed. For the ZyPer4K products there are four Join Configurations and for the ZyPerUHD and ZyPerHD there are two pre-defined join configurations. The pre-defined Join Configurations are available the first time a user logs into Maestro Z.</p>
          <p><strong>3.2.1 ZyPer4K Pre-Defined Join Configurations</strong></p>
          <p><strong>Fast-switched</strong></p>
          <p>Establishes a video connection in fast-switched mode, HDMI Downmix Audio embedded on the HDMI cable, and HDMI Downmix Audio de-embedded and routed to the analog port on the ZyPer4K Decoder.</p>
          <p>ZyPerHD does not support independent routing of audio and video. When a Join is issued to ZyPerHD devices, video and audio will be routed in one multicast stream.</p>
          <p><strong>Genlocked</strong></p>
          <p>Establishes a video connection in genlocked mode, HDMI Audio embedded on the HDMI cable, and HDMI Downmix Audio de-embedded and routed to the analog port on the ZyPer4K Decoder. ZyPerUHD and ZyPerHD do not support Genlocked mode.</p>
          <p><strong>USB</strong></p>
          <p>Establishes an USB connection between a Source and a Display. This Join will only work on devices that support USB. ZyPerHD does not support USB.</p>
          <p><strong>Disconnect A/V</strong></p>
          <p>This disconnects all audio and video connections between a Source and a Display.</p>
          <h2 style={h2Style}><strong>3.2.2 ZyPerUHD Pre-Defined Join Configurations</strong></h2>
          <p><strong>Fast-switched</strong></p>
          <p>Establishes a video and audio connection in fast-switched mode with a ZyPerUHD Display.&nbsp; This join will connect video, audio, RS-232, IR and USB between the Source and Display.</p>
          <p><strong>Disconnect AV</strong></p>
          <p>This disconnects all connections between a Source and a Display.&nbsp; This includes video, audio, RS-232, IR and USB.</p>
          <h2 style={h2Style}><strong>3.2.3 ZyPerHD Pre-Defined Join Configurations</strong></h2>
          <p><strong>Fast-switched</strong></p>
          <p>Establishes a video and audio connection in fast-switched mode with a ZyPerHD Display.&nbsp; This join will connect video and audio between the Source and Display.</p>
          <p><strong>Disconnect AV</strong></p>
          <p>This disconnects all audio and video connections between a Source and a Display.</p>
          <h2 style={h2Style} ref="_3.3_How_are">3.3 How are they used?</h2>
          <p><strong>Default</strong> - This is the Join Configuration that is shaded. This is the set of commands that will be executed when a Source icon is selected (single-cick) and then a destination is selected.&nbsp; The destination can be a Display, Video Wall or Zone.</p>
          <p><strong>Non-default</strong> - Click on Source icon to open the Join Configuration selection window. Select the lightning bolt icon and drag it onto a Display, Video Wall or a Zone. The commands associated with that Join Configuration will be processed.</p>
          <h2 style={h2Style} ref="_3.4_Creating_a">3.4 Creating a new Join Configuration</h2>
          <p>Right-click on a Source icon and select Configure Join (gear icon) to open the Join Configuration selection window. Click the &ldquo;+&rdquo; icon to create a new Join Configuration.</p>
          <p>All settings will be set to &ldquo;no change&rdquo; by default. Only configure values that are required for a custom Join.</p>
          <p><strong>Video</strong></p>
          <ul>
          <li>Name of the ZyPer Encoder. The default name is MAC address but this can be changed to a friendly name. Spaces and special characters are not supported in device names</li>
          <li>No Change - No change to video will be applied</li>
          <li>Fast Switched - Video will be joined in Fast-Switched mode</li>
          <li>Genlocked - Video will be joined in Genlocked mode - ZyPerUHD &amp; ZyPerHD do not support Genlocked</li>
          <li>Disconnect - Video connections will be unjoined</li>
          </ul>
          <p><strong>Digital Audio</strong></p>
          <ul>
          <li>HDMI - Embedded audio will be joined, including multi-channel audio (only available in genlocked mode)</li>
          <li>Downmix - Digital audio downmixed to two-channel digital which can be independently routed from the video. Embedded on HDMI cable.</li>
          <li>Analog - Digital audio downmixed to two-channel analog which can be independently routed from the video. Routed through analog audio port on ZyPer Decoder.</li>
          <li>Disconnect - Digital audio connections will be unjoined</li>
          <li>These settings are valid for ZyPer4K only. ZyPerUHD and ZyPerHD do not support independent audio routing.</li>
          </ul>
          <p><strong>Analog Audio</strong></p>
          <ul>
          <li>No Change - No change to audio will be applied</li>
          <li>Downmix - Digital audio from the Source routed to the analog audio port of a Display</li>
          <li>Analog - Analog audio from the analog audio port of a Source routed to the analog audio port of a Display</li>
          <li>Disconnect - Analog audio connections will be unjoined</li>
          <li>These settings are valid for ZyPer4K only. ZyPerUHD and ZyPerHD do not support independent audio routing.</li>
          </ul>
          <p><strong>RS232</strong></p>
          <ul>
          <li>No Change - No change to RS232 connection will be applied</li>
          <li>Connect - Establish a two-way RS232 connection between a Source and a Display</li>
          <li>Disconnect - The two-way* connection between Source and the Display will be unjoined</li>
          </ul>
          <p>* Maestro Z will establish two RS232 connections. One from the Source to the Display and a one from the Display to the Source. Communication parameters like baudrate must be configured on both the Source and the Display to ensure proper two-way communication. To establish a one-way RS232 connection, please use the telnet API</p>
          <p>For more information on telnet API please refer to the ZyPer Management Platform User Guide available on <a href="http://www.zeevee.com/support" target="_blank" rel="noopener noreferrer">www.zeevee.com/support</a>.</p>
          <p><strong>IR</strong></p>
          <ul>
          <li>No Change - No change to IR connection will be applied</li>
          <li>Connect - Establish a two-way* IR connection between a Source and a Display</li>
          <li>Disconnect - The two-way* connection between the Source and the Display will be unjoined</li>
          <li>These settings are valid for ZyPer4K only.
          <ul>
          <li>ZyPerUHD IR will automatically be Joined when a video Join has been made.</li>
          <li>ZyPerHD does not support IR.</li>
          </ul>
          </li>
          </ul>
          <p>* Maestro Z will establish two IR connections. One from the Source to the Display and a one from the Display to the Source. To establish a one-way IR connection, please use the telnet API</p>
          <p>For more information on telnet API please refer to the ZyPer Management Platform User Guide available on <a href="http://www.zeevee.com/support" target="_blank" rel="noopener noreferrer">www.zeevee.com/support</a>.</p>
          <p><strong>USB</strong></p>
          <ul>
          <li>No Change - No change to USB connection will be applied</li>
          <li>Connect - Establish a connection between an USB-enabled Source and an USB-enabled Display</li>
          <li>Disconnect - The USB connection between the Source and the Display will be unjoined</li>
          <li>These settings are valid for ZyPer4K only.
          <ul>
          <li>ZyPerUHD USB will automatically be Joined when a video Join has been made.</li>
          <li>ZyPerHD does not support USB.</li>
          </ul>
          </li>
          </ul>
          <p>A ZyPer4K USB-enabled Source can support up to 4 ZyPer4K USB-enabled Displays at one time.</p>
          <h2 style={h2Style} ref="_3.5_Modify_a">3.5 Modify a Join Configuration</h2>
          <p>Click on the edit icon in the lower left-hand corner Join Configuration box</p>
          <h2 style={h2Style} ref="_3.6_Delete_Join">3.6 Delete Join Configuration</h2>
          <p>To delete a Join Configuration, click on the trash icon in the lower right-hand corner of the Join Configuration box</p>
          <h2 style={h2Style} ref="_3.7_Fast_Switched">3.7 Fast Switched vs. Genlocked</h2>
          <p>Fast Switched - ZyPer4K - The switch between sources occurs nearly seamlessly, no blank screen or pause between sources. This introduces a latency of about 1 - 2 frames.</p>
          <p>Fast Switched - ZyPerUHD - This is the only video switching mode supported. Latency with ZyPerHD is between 60 - 90 milliseconds.</p>
          <p>Fast Switched - ZyPerHD - This is the only video switching mode supported. Latency with ZyPerHD is between 2 - 5 milliseconds (1-2 fps).</p>
          <p>Genlocked - ZyPer4K - The Display is synchronized to the Source with zero-frame latency translating into less than 0.1 millisecond. Joining Video in Genlocked mode will display a blank screen for a few seconds.</p>
          <h2 style={h2Style} ref="_3.8_Resetting_default">3.8 Resetting default configurations</h2>
          <p>Click on the circular arrow icon to delete all custom Join Configurations and to restore default Join Configuration settings. NOTE: This will affect all users and it cannot be undone. Click on "yes" to confirm restoration of default settings.</p>
          <h1 style={h1Style} ref="_4.0_Video_Walls">4 Video Walls</h1>
          <p>A Video Wall is a collection of Displays that spread video from a single Source across the member Displays. For example, a 2x2 Video Wall would consist of four displays in total, which includes two Displays wide by two Displays tall. Video walls can be created up to 5x5 Displays for ZyPer4K and ZyPerUHD devices, and 4x4 Displays for ZyPerHD. Video Walls are product specific and may only include ZyPer4K, ZyPerUHD or ZyPerHD. The three product lines cannot be combined in the same Video Wall.</p>
          <h2 style={h2Style}>4.1 Filter</h2>
          <p>Click on the funnel shaped icon at the top of the panel to open the filter options. Allows for filtering of Video Walls based on the text entered in the "Filter by" box. To find a specific Video Walls, start typing the name and Video Walls that do not match the text entered will be hiddend from view.&nbsp; All Video Walls can viewed by clearing the "Filter by" box.</p>
          <h2 style={h2Style}>4.2 Create a Video Wall</h2>
          <p>Click &ldquo;+&rdquo;</p>
          <p>Enter the name of the Video Wall</p>
          <p>Enter the number of rows in the Video Wall</p>
          <p>Enter the number of columns in the Video Wall</p>
          <p>Enter the bezel size, in pixels, to adjust for the bezel of the display monitor</p>
          <p>Drag and drop a Display into each pane of the Video Wall</p>
          <p>Click Create</p>
          <p><em>Please Note: ZyPerUHD and ZyPerHD do not support bezel compensation. If a value is entered in the bezel compensation for either ZyPerUHD or ZyPerHD Video Wall, the value will be ignored.</em></p>
          <h2 style={h2Style}>4.3 Edit a Video Wall</h2>
          <p>Click on the edit icon of the Video Wall</p>
          <p>Make changes</p>
          <p>Click Update.</p>
          <h1 style={h1Style} ref="_5.0_Multiview">5 Multiview</h1>
          <p>A Multiview is when multiple ZyPer4K Sources are configured in an array and acts as a single source. That Multiview can then be joined to a ZyPer4K. Each Multiview can include up to nine encoders in an array. Multiview functionality is only supported on ZyPer4K HDMI 2.0 encoders and decoders (devices with white metal enclosures). A Multiview must be joined to a 4K Display.</p>
          <p>ZyPer4K HDMI 2.0 Encoders will output 2 video streams with a maximum bandwidth total of 9Gb/sec:</p>
          <p>Full resolution stream - This is a normal stream that can be Joined to any ZyPer4K display, Video Wall or Zone.</p>
          <p>Scaled - This secondary stream can be Joined to a Multiview. There is only one scaled resolution available at a time, attempting to have more than 1 down-scaled resolution will result an error. <em>The ZyPer4K encoder will automatically scale the resolution based on the size of the Multiview window a Source is assigned to.</em></p>
          <h2 style={h2Style}>5.1 Filter</h2>
          <p>Click on the funnel shaped icon at the top of the panel to open the filter options. Allows for filtering of Multiviews based on the text entered in the "Filter by" box. To find a specific Multiview, start typing the name and Multiviews that do not match the text entered will be hidden from view.&nbsp; All Video Multiviews can viewed once again by clearing the "Filter by" box.</p>
          <h2 style={h2Style}><strong>5.2 Create a Multiview</strong></h2>
          <p>Audio - To assign audio as part of a Multiview, click on the speaker icon in the window of the desired source. This will send HDMI-Downmix audio from that source to the Display the Multiview is joined to. Audio can also be assigned to a Display independent of a Multiview with a separate Join operation</p>
          <p>Grid - The Multiview edit window is divided up into a grid, with each cell representing 5% of 16:9 display in the vertical and in the horizontal directions.</p>
          <p>Windows - Each grey box in a Multiview edit grid is called a window. Each window will have a Source associated with it. Drag and drop a Source in the desired window. <em>The ZyPer4K encoder will automatically scale the resolution based on the size of the Multiview window a Source is assigned to.</em></p>
          <h2 style={h2Style}><strong>5.3 Create a Multiview</strong></h2>
          <p>Click "+"</p>
          <p>Enter the name of a Multiview - blank spaces are not supported in Multiview names.</p>
          <p>Click the Patterns button and select one of the six Multiview Patterns</p>
          <p>Drag and drop ZyPer4K HDMI 2.0 Sources to the desired window.</p>
          <p>Click the Save button.</p>
          <h2 style={h2Style}><strong>5.4 Edit a Multiview</strong></h2>
          <p>Click the edit icon of the Multiview</p>
          <p>Make the desired changes to the Multiview, such as changing Sources, Source locations within the Multiview or which Source will supply audio.</p>
          <p>Click the Save button to apply the changes.</p>
          <h2 style={h2Style}><strong>5.5 Rename a Multiview</strong></h2>
          <p>Click the edit icon of the Multiview</p>
          <p>chick the arrow next to the Save button and select the Enable Rename option from the list.</p>
          <p>Enter the new name in the name field and click the Save button.</p>
          <h2 style={h2Style}><strong>5.6 Copy a Multiview</strong></h2>
          <p>Click the edit icon of the Multiview</p>
          <p>click the arrow next to the Save button and select the Enable Save As option from the list.</p>
          <p>Enter a new name for the Multiview copy and click the Save As button.</p>
          <p>A new Multiview icon will appear in the Multiview panel.</p>
          <h2 style={h2Style}>5.7 Multiview Preset Patterns</h2>
          <p>Multiview includes six preset patterns, 2x2, 3x3 and four different L-Shaped patterns.</p>
          <p>2x2 - Four windows aligned in a 2-wide, 2-high pattern. Each scaled window will output a resolution of 1920x1080. This Multiview configuration will use 100% of the space with no border. If the monitor has overscan enabled, a portion of the image may be cut off around the edges.</p>
          <p>This Multiview can include up to 4 unique Sources or it can be the same source repeated four times, because each scaled window is the same resolution.</p>
          <p>3x3 - Nine windows aligned in a 3-wide, 3-high pattern. Each scaled window will output a resolution of 1152x648. Because of scaling limitations, there is a small black border around the outside of image.</p>
          <p>This Multiview can include up to 9 unique Sources or it can be the same source repeated multiple times, because each scaled window is the same resolution.</p>
          <p>L-Shaped - Six windows arranged with a larger window in the corner with 5 smaller windows wrapped around two sides of the larger window. The larger window has a resolution of 2304x1296 with five smaller windows with a resolution of 1152x648 each. There are four variants of this Multiview, each arranged with the larger window in a different corner.</p>
          <p>This Multiview can include up to 6 unique Sources or 1 Source for the larger window and a different Source or Sources for the smaller window.</p>
          <h1 style={h1Style} ref="_6.0_Zones">6 Zones</h1>
          <p>A Zone is a group of Displays that are managed together as one Display for the purposes of sending video and audio. Just drag and drop one Source onto a Zone and the video and audio from that one Source will be linked to all the Displays in the Zone and any Subzones. Zones are <em>NOT</em> product specific and may include any combination of ZyPer4K, ZyPerUHD, and ZyPerHD devices. However, Joins will only be established between the same product group.&nbsp; For example, if a ZyPer4K Source is dropped onto a Zone that contains ZyPer4K and ZyPerUHD devices, the Join will only be established with the ZyPer4K Displays and the ZyPerUHD displays will be ignored.</p>
          <p>The Zone panel is divided vertically into two sections.&nbsp; The left-hand side lists all the Zones and Subzones defined. To view Subzones, click on the right-facing arrow near the Zone name.&nbsp; The arrow will point down and all Subzones will be listed, or "none" if no Subzones have been created.&nbsp; To hide the Subzones, click on the down arrow. The Right-hand side is the edit screen, which will also show Zone thumbnails, used when Joining Sources.&nbsp; To show all top-level Zones</p>
          <h2 style={h2Style}>6.1 Filter</h2>
          <p>Click on the funnel shaped icon at the top of the panel to open the filter options. Allows for filtering of Zones based on the text entered in the "Filter by" box. To find a specific Zone, start typing the name and Multiviews that do not match the test entered will be hidden from view. The filter will be applied to thumbnails visible on the right-hand side of the panel.&nbsp; All Zones can viewed by clearing the "Filter by" box.</p>
          <h2 style={h2Style}>6.2 Create a Zone</h2>
          <p>In the Edit area (right-hand side) click "+"</p>
          <p>Enter the name of a Zone</p>
          <p>Drag and drop all desired Displays to the Zone into the space below the Zone name</p>
          <p>Click Create</p>
          <p>The Zone name will appear on the left-hand side of the panel and a new thumbnail will appear on the right-hand side.</p>
          <h2 style={h2Style}>6.3 Edit a Zone</h2>
          <p>In the Zone list (left-hand side), click on a Zone name to highlight it</p>
          <p>Drag and drop any desired Displays to the Zone to the right-hand side edit area</p>
          <p>Click the trash icon for any Displays to be removed from the Zone</p>
          <p>Click Update</p>
          <h2 style={h2Style}>6.4 Create a SubZone</h2>
          <p>In the Zone list (left-hand side), click on a Zone name to highlight it</p>
          <p>In the Edit area (right-hand side) click "+"</p>
          <p>Drag and drop all desired Displays to the Zone into the space below the Zone name</p>
          <p>Click Create</p>
          <p>The Subzone name will appear on the left-hand side of the panel and a new thumbnail will appear on the right-hand side</p>
          <p>Repeat this process to create a Subzone of the Subzone</p>
          <h1 style={h1Style} ref="_7.0_Server">7 Server</h1>
          <p>This section will include information related to the ZyPer server computer and the version of software installed.</p>
          <h2 style={h2Style}>7.1 Status</h2>
          <ul>
          <li>HostName - default is zyper.local</li>
          <li>IP - default is DHCP</li>
          <li>MAC - the MAC address of ZyPer Management Platform computer</li>
          <li>Version - the version of Maestro Z</li>
          <li>Serial Number - hardcoded unique identifier</li>
          <li>Uptime - the elapsed time since the server has been restarted</li>
          <li>Free Memory - memory available to the server</li>
          </ul>
          <p>All the information in this section is provided for reference only. This information is not configurable from Maestro Z. For information and instructions on how to modify the Host Name, the IP address, and the server software version, refer to the ZyPer Management Platform User Manual.</p>
          <h2 style={h2Style}>7.2 Config</h2>
          <h2 style={h2Style}>7.2.1 EDID Mode</h2>
          <p>EDID is a list of supported and preferred resolutions provided by a Display to a Source. For example, when a PC is connected to a monitor, EDID is passed from the monitor to the PC. However, with ZyPer the display monitor does not connect to the video source directly, preventing the normal sharing of EDID information.</p>
          <p>To account for this, ZyPer has been designed to read the EDID from the Display monitor and forward it to the Source that requires that information. This feature is called "Auto EDID" which is enabled by default. To disable Auto EDID, select the "Disabled" radio button next to EDID Mode and the change is saved automatically.</p>
          <p>Auto EDID must be enabled for Multiview to function properly.</p>
          <h2 style={h2Style}>7.2.2 Action buttons</h2>
          <ul>
          <li>Restart - Restarts the ZyPer service on the Management Platform</li>
          <li>Reboot - Reboot of the ZyPer Management Platform computer</li>
          <li>Shut Down - Performs a power off of the ZyPer Management Platform</li>
          <li>Trouble Report - Generates and downloads a diagnostic file to send to ZeeVee support</li>
          </ul>
          <h2 style={h2Style}>7.3 License</h2>
          <ul>
          <li>Product ID - Hardware specific ID</li>
          <li>License - Hardware specific license key provided by ZeeVee</li>
          <li>Limit - The number of endpoints supported by license key</li>
          <li>Devices Exceeded - The number of active endpoints that exceed the number of licenses</li>
          </ul>
          <h2 style={h2Style}>7.4 Update server software</h2>
          <p>Update the Management Platform software - Please refer to section 9.1 of this help file for software update steps.</p>
          <h1 style={h1Style} ref="_8.0_Logs">8 Logs</h1>
          <p>All action confirmations, warnings, and errors messages are displayed in the log panel. When a join or unjoin is attempted, a notification is added to the log panel and a counter will display on the top of the Maestro Z window. The counter will track all successful action with the green icon, and all failed actions with a red icon and informational messages will be in blue. Click on any of the counter icons to open the log panel and to clear the counter.</p>
          <h2 style={h2Style}>8.1 Filter</h2>
          <p>Click on the funnel shaped icon at the top of the panel to open the filter options. Allows for filtering of messages based on the text entered in the "Filter by" box. To find a specific message, start typing the desired text in the "Filter-by" box. All messages can be viewed by clearing the "Filter by" box.</p>
          <h1 style={h1Style} ref="_9.0_How_to">9 How to&hellip;</h1>
          <h2 style={h2Style}>9.1 Update the Management Platform Software</h2>
          <p>Follow these steps to update the ZyPer Management Platform Software</p>
          <ol>
          <li>Download the latest software from the ZeeVee <a title="ZyPer MP Software" href="https://www.zeevee.com/zyper-mp-firmware" target="_blank" rel="noopener noreferrer">website</a>. Make note of the location on the local computer where the software was downloaded</li>
          <li>Enable the Server panel from the Panel Selection Menu</li>
          <li>Drag the ZyPer update file and drop it in the box that reads "drop file here"</li>
          <li>The ZyPer update file name will appear below the words "Selected file"</li>
          <li>Click the "Update Server" button</li>
          <li>A confirmation box will appear. Click "Update" to proceed and "Cancel" to abandon the update</li>
          <li>When Update is selected, the box will disappear and the ZyPer Management Platform will reboot</li>
          <li>It may be required to close the browser and log back in for updates to take effect</li>
          </ol>
          <h2 style={h2Style}>9.2 Update Device Firmware</h2>
          <h2 style={h2Style}>9.2.1 ZyPer4K Encoders and Decoders</h2>
          <ol>
          <li>Download the latest firmware from the ZeeVee <a title="ZeeVee Firmware Updates" href="https://www.zeevee.com/firmware-updates" target="_blank" rel="noopener noreferrer">website</a>. Make note of the location on the local computer where the firmware was downloaded</li>
          <li>Extract the two *.BIN files from the downloaded file.</li>
          <li>Enable the Source and/or Display panel from the Panel Selection Menu</li>
          <li>Click on device name and select Actions</li>
          <li>Drop the update *.ZIP file in the outlined box under the note.</li>
          <li>The *.ZIP file name will appear below the words "Selected file"</li>
          <li>Click the "Update Device" button</li>
          <li>A confirmation box will appear. Click "Update" to proceed and "Cancel" to abandon the update</li>
          <li>Video will drop when the device reboots at the end of the update process</li>
          <li>Refer to log panel for more information on device update</li>
          </ol>
          <h2 style={h2Style}>9.2.2 ZyPerUHD and Encoders and Decoders</h2>
          <ol>
          <li>Download the latest firmware from the ZeeVee <a title="ZeeVee Firmware Updates" href="https://www.zeevee.com/firmware-updates" target="_blank" rel="noopener noreferrer">website</a>. Make note of the location on the local computer where the firmware was downloaded</li>
          <li>Extract the two *.BIN files from the downloaded file. IPE5000_ver#.bin (for the encoders) IPD5000_ver#.bin (for the decoders)</li>
          <li>Enable the Source and/or Display panel from the Panel Selection Menu</li>
          <li>Click on device name and select Actions</li>
          <li>Drop the appropiate *.BIN file in the outlined box under the note.</li>
          <li>The *.BIN file name will appear below the words "Selected file"</li>
          <li>Click the "Update Device" button</li>
          <li>A confirmation box will appear. Click "Update" to proceed and "Cancel" to abandon the update</li>
          <li>Video will drop when the device reboots at the end of the update process</li>
          <li>Refer to log panel for more information on device update</li>
          </ol>
          <h2 style={h2Style}>9.2.3 ZyPerHD and Encoders and Decoders</h2>
          <ol>
          <li>Download the latest firmware from the ZeeVee <a title="ZyPerHD Firmware Updates" href="https://www.zeevee.com/zyperhdfirmware" target="_blank" rel="noopener noreferrer">website</a>. Make note of the location on the local computer where the firmware was downloaded</li>
          <li>Extract the two *.BIN files from the downloaded file. IPE2000_ver#.bin (for the encoders) IPD2000_ver#.bin (for the decoders)</li>
          <li>Enable the Source and/or Display panel from the Panel Selection Menu</li>
          <li>Click on device name and select Actions</li>
          <li>Drop the appropiate *.BIN file in the outlined box under the note.</li>
          <li>The *.BIN file name will appear below the words "Selected file"</li>
          <li>Click the "Update Device" button</li>
          <li>A confirmation box will appear. Click "Update" to proceed and "Cancel" to abandon the update</li>
          <li>Video will drop when the device reboots at the end of the update process</li>
          <li>Refer to log panel for more information on device update</li>
          </ol>
          <h2 style={h2Style}><strong>9.3 ZyPer Management Platform User Guide</strong></h2>
          <p>The full user guide can be found online at <a href="https://www.zeevee.com/support" target="_blank" rel="noopener noreferrer">ZeeVee.com/support</a></p>

        </div>
      </Panel>
    );
  }
}

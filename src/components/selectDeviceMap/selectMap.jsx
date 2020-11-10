import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { observer } from 'mobx-react';
import { Map, Markers, InfoWindow } from 'react-amap';
import PropTypes from 'prop-types';
import Tablestore from 'store/tablestore';
import centerIcon from 'images/position-picker2.png';
// import markerlist from './list.json';

const store = new Tablestore();
@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      devicePos: null,
      showDeviceWin: null,
      centerPosition: ''
    };
    // 地图中心点
    this.center = window.apiUrl.split('/')[3] === 'zt_shbx' ?
      {
        longitude: '120.431917',
        latitude: '31.321714'
      } :
      {
        longitude: '121.585457',
        latitude: '31.271419'
      };
    this.sendCenterLan = this.sendCenterLan.bind(this);
    this.closePopInfo = this.closePopInfo.bind(this);
    this.closeMapFn = this.closeMapFn.bind(this);
    this.instance = null;// 全局地图实例
    this.mapEvents = {
      created: (instance) => {
        window.AMap.plugin(
          ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.ToolBar'],
          () => {
            // instance.addControl(new window.AMap.ToolBar({
            //  position: 'RT'
            // }));
            this.instance = instance;
            this.initMapFn(instance);
          }
        );
      },
      click: () => {
        this.setState({
          showDeviceWin: null
        });
      }
    };
    this.markersEvents = {
      click: (e, marker) => {
        const extData = e === 'alarm' ? marker : marker.getExtData();
        this.setState({
          showDeviceWin: 1,
          devicePos: extData.position
        });
      }
    };
  }
  componentDidMount() {
    $('#mapCont').css('height', $(window).height());
  }
  componentWillUnmount() {
    if (this.instance !== null) {
      this.instance.destroy();
    }
  }
  initMapFn(instance) {
    window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: instance,
        iconStyle: { // 自定义外观
          url: centerIcon,
          ancher: [24, 40],
          size: [48, 48]
        }
      });

      positionPicker.on('success', (positionResult) => {
        document.getElementById('lnglat').innerHTML = positionResult.position;
        this.setState({ centerPosition: positionResult.position });
      });
      positionPicker.on('fail', (positionResult) => {
        document.getElementById('lnglat').innerHTML = ' ';
        this.setState({ centerPosition: '' });
      });
      positionPicker.start();
      instance.panBy(0, 1);

      instance.addControl(new AMap.ToolBar({
        liteStyle: true
      }));
    });


    // 输入提示查询
    const autoOptions = {
      input: 'tipinput'
    };
    const auto = new AMap.Autocomplete(autoOptions);
    const placeSearch = new AMap.PlaceSearch({
      map: instance,
      pageSize: 1
    }); // 构造地点查询类
    AMap.event.addListener(auto, 'select', select);// 注册监听，当选中某条记录时会触发
    function select(e) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); // 关键字查询查询
    }
  }
  sendCenterLan(params = {}) {
    const that = this;
    const queryParam = {
      url: 'item/getItemsXY',
      method: 'post',
      data: {
        lon: this.state.centerPosition.lng,
        lat: this.state.centerPosition.lat,
        radius: 1 // 单位： Km
      },
      successFn(data) {
        const tempMarkers = data.data.map((item, index) => ({
          key: index,
          position: {
            ...item,
            longitude: item.lon,
            latitude: item.lat
          }
        }));

        that.setState({ markers: tempMarkers });
      }
    };
    store.handleUser(queryParam);
  }
  sendHouseLanFn(lonLat) {
    this.props.handleItemId(lonLat.item_id, lonLat.item_name);
    this.setState({
      showDeviceWin: null
    });
    this.closeMapFn();
  }
  closePopInfo() {
    this.setState({ showDeviceWin: null });
  }
  closeMapFn() {
    this.props.closeMapFn();
    this.setState({ markers: [], showDeviceWin: null });
  }
  renderDeviceMarker=(extData) => {
    const type = extData.position.flag;
    if (type === 1) {
      return <span className="houseIcon" />;
    } else if (type === 2) {
      return <span className="buildIcon" />;
    } else if (type === 3) {
      return <span className="townIcon" />;
    }
    return null;
  }
  render() {
    return (
      <div id="mapCont" style={{ position: 'relative' }}>
        <div className="myPageTop">
          <label className="search-tit">请输入关键字：</label>
          <input id="tipinput" />
          <div className="c">经纬度:</div>
          <div id="lnglat" />
          <Button type="primary" onClick={this.sendCenterLan} style={{ marginTop: '5px' }}>
            发送中心点
          </Button >
        </div>
        {/* <div id="container" /> */}
        <Map
          amapkey="a15d19b9d7b2db3fc03d9c11669e20e3"
          // mapStyle="amap://styles/9b7814bc72e39d90b42cb0ea74d68ce4"
          zoom={16}
          useAMapUI
          center={this.center}
          events={this.mapEvents}
        >
          <Markers
            render={this.renderDeviceMarker}
            markers={this.state.markers}
            events={this.markersEvents}
          />
          <InfoWindow
            className="popDiv"
            position={this.state.devicePos}
            visible={this.state.showDeviceWin === 1}
            isCustom
          >
            {<div>
              <div style={{
 fontSize: '14px', borderBottom: '1px dashed #BBC2D2', padding: '5px 10px', marginBottom: '5px'
}}
              >
                位置名称：{this.state.devicePos ? this.state.devicePos.item_name : ''}<br />
                是否选此位置？
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.closePopInfo} style={{ margin: '5px 10px 0 0' }}>否</Button >
                <Button type="primary" onClick={this.sendHouseLanFn.bind(this, this.state.devicePos)} style={{ marginTop: '5px' }}>是</Button >
              </div>
            </div>}
          </InfoWindow>
        </Map>
        <Icon type="close-circle-o" className="closeIcon" onClick={this.closeMapFn} />
      </div>
    );
  }
}

PageComponent.propTypes = {
  handleItemId: PropTypes.func.isRequired,
  closeMapFn: PropTypes.func.isRequired
};
export default PageComponent;

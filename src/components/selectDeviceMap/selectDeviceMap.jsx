import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { observer } from 'mobx-react';
import { Map } from 'react-amap';
// import PropTypes from 'prop-types';
import './selectDeviceMap.less';
import $ from 'jquery';
import {
  CloseOutlined
} from '@ant-design/icons';

@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.center = window.apiUrl.split('/')[3] === 'zt_shbx'
      ? {
        longitude: '120.431917',
        latitude: '31.321714'
      }
      : {
        longitude: '121.585457',
        latitude: '31.271419'
      };
    // this.closeMapFn = this.closeMapFn.bind(this);
    this.sendPos = this.sendPos.bind(this);
    this.instanceDevice = null;// 全局地图实例
    this.mapEvents = {
      created: (instance) => {
        window.AMap.plugin(
          ['AMap.Autocomplete', 'AMap.PlaceSearch'],
          () => {
            // instance.addControl(new window.AMap.ToolBar({
            //  position: 'RT'
            // }));
            this.instanceDevice = instance;
            this.initMapFn(instance);
          }
        );
      },
      click: (e) => {
        document.getElementById('lnglat2').innerHTML = `${e.lnglat.getLng()},${e.lnglat.getLat()}`;
      }
    };
  }

  componentDidMount() {
    $('#mapCont').css('height', $(window).height());
  }

  componentWillUnmount() {
    if (this.instanceDevice !== null) {
      this.instanceDevice.destroy();
    }
  }

  initMapFn(instance) {
    // 输入提示查询
    const autoOptions = {
      input: 'tipinput2'
    };
    const auto = new window.AMap.Autocomplete(autoOptions);
    const placeSearch = new window.AMap.PlaceSearch({
      map: instance
    }); // 构造地点查询类
    function select(e) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); // 关键字查询查询
    }
    window.AMap.event.addListener(auto, 'select', select);// 注册监听，当选中某条记录时会触发
  }

  sendPos() {
    // const { handlePos } = this.props;
    const lonLatCont = document.getElementById('lnglat2').innerHTML;
    let tempLonLat;
    if (lonLatCont !== '') {
      tempLonLat = lonLatCont.split(',');
      // handlePos(tempLonLat);
    }
    // this.closeMapFn();

    // const data = {
    //   ...values
    // };
    this.props.onTrigger('okBtn', tempLonLat);
  }

  // closeMapFn() {
  //   const { closeDevice } = this.props;
  //   closeDevice();
  // }

  render() {
    return (
      <div id="mapCont" className="mapDiv" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div className="myPageTop">
          <label className="search-tit">请输入关键字：</label>
          <input id="tipinput2" style={{ border: '1px solid #cfcfcf' }} />
          <div className="c lonlatTxt">经纬度:&nbsp;&nbsp;<span id="lnglat2" /></div>
          <Button type="primary" onClick={this.sendPos} style={{ marginTop: '5px', lineHeight: '18px' }}>
            选取经纬度
          </Button>
        </div>
        {/* <div id="container" /> */}
        <Map
          amapkey="a15d19b9d7b2db3fc03d9c11669e20e3"
          // mapStyle="amap://styles/9b7814bc72e39d90b42cb0ea74d68ce4"
          zoom={16}
          useAMapUI
          center={this.center}
          events={this.mapEvents}
        />
        {/* <CloseOutlined className="closeIcon" onClick={this.closeMapFn} /> */}
        {/* <Icon type="close-circle-o" className="closeIcon" onClick={this.closeMapFn} /> */}
      </div>
    );
  }
}

export default PageComponent;

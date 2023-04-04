import React, {
  Component, useState, useEffect, useReducer, useCallback, useRef
} from 'react';
import './selectDeviceMap.less';
// import {
//   useNavigate
// } from 'react-router-dom';
import {
  Form, Input, Button
} from 'antd';
// import Layout from 'components/layout/layout';
import { observer } from 'mobx-react-lite';
import store from 'store/glstore';
import {
  Map, Marker, Polygon, Label, MapApiLoaderHOC, NavigationControl, InfoWindow, AutoComplete
} from 'react-bmapgl';
import {
  EnvironmentOutlined
} from '@ant-design/icons';
import locationTit from 'images/locationTit.png';

const initialState = {
  selectedRowKeys: [],
  selectedRows: [],
  treeData: [],
  searchFilter: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'selectedRowKeys':
      return { ...state, selectedRowKeys: action.selectedRowKeys };
    case 'searchFilter':
      return { ...state, searchFilter: action.searchFilter };
    case 'selectedRowKeysselectedRows':
      return { ...state, selectedRowKeys: action.selectedRowKeys, selectedRows: action.selectedRows };
    case 'fetchtreedata':
      return { ...state, treeData: action.data };
    default:
      throw new Error();
  }
}

function PageComponent(props) {
  const manRef = useRef();
  // const routeParams = useParams();

  // const navigate = useNavigate();
  const [mapcenter, setMapcenter] = useState({ lng: 118.828379, lat: 32.021485 });
  const [labelshow, setLabelshow] = useState(false);

  function handleMarkClick() {
    store.dataObj.hRad1 = '1';
    manRef.current.centerAndZoom(mapcenter, 17);
  }
  function G(id) {
    return document.getElementById(id);
  }
  useEffect(() => {
    const map = manRef.current;

    // const bd = new BMapGL.Boundary();
    // bd.get('南京市', (rs) => {
    //   // console.log('外轮廓：', rs.boundaries[0]);
    //   // console.log('内镂空：', rs.boundaries[1]);
    //   const hole = new BMapGL.Polygon(rs.boundaries, {
    //     // fillColor: 'blue',
    //     strokeColor: '#7AFEEE',
    //     fillOpacity: 0
    //   });
    //   map.addOverlay(hole);
    // });

    // const myIcon = new BMapGL.Icon(locationTit, new BMapGL.Size(20, 32), {
    //   // 指定定位位置。
    //   // 当标注显示在地图上时，其所指向的地理位置距离图标左上
    //   // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
    //   // 图标中央下端的尖角位置。
    //   anchor: new BMapGL.Size(17, 10)
    //   // 设置图片偏移。
    //   // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
    //   // 需要指定大图的偏移位置，此做法与css sprites技术类似。
    //   // imageOffset: new BMapGL.Size(0, 0 - 25)   // 设置图片偏移
    // });

    // const point = new BMapGL.Point(mapcenter.lng, mapcenter.lat);
    // const marker = new BMapGL.Marker(point, { icon: myIcon }); // 创建标注
    // map.addOverlay(marker);
    // marker.addEventListener('click', () => {
    //   handleMarkClick();
    // });

    // map.addEventListener('zoomend', () => {
    //   // 这里根据缩放显示和隐藏文本
    //   const currentZoom = map.getZoom();
    //   // currentZoom <= 13 ? setLabelshow(false) : setLabelshow(true);
    //   setLabelshow(!(currentZoom <= 15));
    // });

    /* 地图搜索开始 */
    // 百度地图API功能

    const ac = new BMapGL.Autocomplete( // 建立一个自动完成的对象
      {
        input: 'suggestId',
        location: map
      }
    );

    ac.addEventListener('onhighlight', (e) => { // 鼠标放在下拉列表上的事件
      let str = '';
      let _value = e.fromitem.value;
      let value = '';
      if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str = `FromItem<br />index = ${e.fromitem.index}<br />value = ${value}`;

      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str += `<br />ToItem<br />index = ${e.toitem.index}<br />value = ${value}`;
      G('searchResultPanel').innerHTML = str;
    });

    let myValue;
    ac.addEventListener('onconfirm', (e) => { // 鼠标点击下拉列表后的事件
      const _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      G('searchResultPanel').innerHTML = `onconfirm<br />index = ${e.item.index}<br />myValue = ${myValue}`;

      setPlace();
    });

    function setPlace() {
      map.clearOverlays(); // 清除地图上所有覆盖物
      function myFun() {
        const pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMapGL.Marker(pp)); // 添加标注
      }
      var local = new BMapGL.LocalSearch(map, { // 智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }

    map.addEventListener('click', (e) => {
      // alert(`点击位置经纬度：${e.latlng.lng},${e.latlng.lat}`);
      map.clearOverlays(); // 清除地图上所有覆盖物
      setMapcenter({ lng: e.latlng.lng, lat: e.latlng.lat });
      map.centerAndZoom({ lng: e.latlng.lng, lat: e.latlng.lat }, 18);
      map.addOverlay(new BMapGL.Marker({ lng: e.latlng.lng, lat: e.latlng.lat })); // 添加标注
    });

    /* 地图搜索结束 */
  }, []);

  function handlePolyClick() {
    const myIndex = `${window.routername}/three`;
    navigate(myIndex);
  }

  const selectPos = (e) => {
    console.log(mapcenter);
    props.onTrigger('okBtn', mapcenter);
  };

  return (
    <div className="webglWrap" style={{ width: '100%', height: '600px' }}>
      <div>
        <div id="r-result">请搜索：<input type="text" id="suggestId" size="20" style={{ width: '250px' }} /></div>
        <div
          id="searchResultPanel"
          style={{
            border: '1px solid #C0C0C0', width: '150px', height: 'auto', display: 'none'
          }}
        />
        <div className="my-3">经纬度：{mapcenter.lng},{mapcenter.lat} <Button style={{ marginLeft: '50px' }} type="primary" size="small" onClick={selectPos}>选取经纬度</Button></div>
      </div>

      {/* <div>
        <AutoComplete
          location="南京"
          onHighlight={(e) => { console.log(e); }}
          onConfirm={(e) => { handleConfirmSearch}}
          onSearchComplete={(e) => { console.log(e); }}
        />
      </div> */}

      <Map
        ref={(ref) => { manRef.current = ref?.map; }}
        center={mapcenter}
        mapStyleV2={{ styleId: '2105683efb9d080633feaf8d6aa01496' }}
        zoom={10}
        style={{ height: '90%' }}
        enableScrollWheelZoom
      >
        <Marker
          position={mapcenter}
          // icon={EnvironmentOutlined}
          // onClick={handleMarkClick.bind(this, 'testmarker')}
        />
        {/*
        {
          labelshow ? (
            <Label
              position={new BMapGL.Point(mapcenter.lng, mapcenter.lat)}
              text="观泓雅苑小区"
              style={{
                fontSize: '18px', color: '#7BFFEF', background: 'none', border: 'none', marginTop: '-42px', marginLeft: '-50px'
              }}
            />
          ) : ''
        } */}
        {/* <Polygon
          path={[
            new BMapGL.Point(118.831039, 32.021943),
            new BMapGL.Point(118.831228, 32.01983),
            new BMapGL.Point(118.826395, 32.019853),
            new BMapGL.Point(118.826547, 32.022976)
          ]}
          strokeColor="#77F6E7"
          strokeWeight={2}
          fillColor="#77F6E7"
          fillOpacity={0.3}
          // onClick={handlePolyClick}
        /> */}

        {/* <NavigationControl /> */}
        {/* <InfoWindow position={mapcenter} text="内容" title="标题"/> */}
      </Map>
    </div>
  );
}
export default MapApiLoaderHOC({ ak: '4ee6c8d2ca7d916fb0020f679918f3d1' })(observer(PageComponent));

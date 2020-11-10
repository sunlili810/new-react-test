import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Map, Markers,Marker, Circle, GroundImage, Polygon  } from 'react-amap';
import './middleMap.less';
import ltIcon from 'images/location.png';
import ltIconActive from 'images/locationActive.png';
import tabStore from 'store/tablestore';

const store = new tabStore();
const alphabet = 'ABCDEFGHIJKLMNOP'.split('');


var preIcon, clickIcon;
var markers=[];

const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: {
      longitude: 100 + Math.random() * 30,
      latitude: 30 + Math.random() * 20,
    },
    myLabel: alphabet[idx],
    myIndex: idx + 1,
  }))
);

const randomPath = () => ({
  longitude: 100 + Math.random() * 50,
  latitude: 10 + Math.random() * 40,
})
const path = [
  {position:{longitude: 117.186514, latitude: 34.184958,deveui:'1'}},
  {position:{longitude: 117.206636, latitude: 34.185436,deveui:'2'}},
  {position:{longitude: 117.277063, latitude: 34.208606,deveui:'3'}},
  {position:{longitude: 117.226471, latitude: 34.18018,deveui:'4'}},
]
@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: path,//[]
      mapCenter:{longitude: 117.288849, latitude: 34.209322},
      path: Array(4).fill(true).map(randomPath),
      videoSrc:'',
      selectedSite:''
    };
    this.instance = null;// 全局地图实例
    this.markerInstance = null;//mark实例
    this.renderMarkerLayout = this.renderMarkerLayout.bind(this);
    this.renderMarkerClick = this.renderMarkerClick.bind(this);
    this.resetMap = this.resetMap.bind(this);
    // 地图设置
    this.amapEvents  = {
      created: (instance) => {
          this.instance = instance;
        this.fetch();
      }
    };
    this.markerEvents = {
      created: (markerInstance) => {
        this.markerInstance=markerInstance;

      },
      click:(MapsOption, marker)=>{
        //console.log('marker:');
        //console.log(marker.getExtData());
        this.setState({videoSrc:'rtmp://58.200.131.2:1935/livetv/hunantv'});
        const {markclickFn}=this.props;
        const tempVideoSrc ='rtmp://58.200.131.2:1935/livetv/hunantv';
        markclickFn(tempVideoSrc);

        const {markerClick}=this.props;
        markerClick(marker.getExtData().position.deveui);
      }
    }


  }

  componentDidMount(){

   //this.fetch();
  }

  componentWillMount() {
    if(this.timer1){
      clearTimeout(this.timer1)
    }
  }

  fetch() {
    const that = this;
    const param = {
      loadingFlag: false,
      url: '/map',
      method: 'POST',
      data: {

      },
      successFn(data) {

        preIcon =new window.AMap.Icon({
          image: ltIcon,
          size: new window.AMap.Size(18, 24), //图标大小
          imageSize:new window.AMap.Size(18, 24)
        });
        clickIcon = new window.AMap.Icon({
          image: ltIconActive,
          size: new window.AMap.Size(18, 24), //图标大小
          imageSize: new window.AMap.Size(18, 24)
        });
        const tempPath = Array.from(data.data).map((item)=>{
          var marker = new window.AMap.Marker({
            map: that.instance,
            position: [item.gpslng,item.gpslat],
            icon: preIcon,
            devname:item.devname,
            //offset: new window.AMap.Pixel(-0, -37)
          })
          markers.push(marker);

        });
        for(var i=0;i<markers.length;i++){
          markers[i].on('click', that.resetMap);
        }
        that.instance.setFitView();

       that.instance.setZoom(10);


        if(tempPath.length!==0){
          const {markerClick}=that.props;
          markerClick(tempPath[0].position.deveui);
        }
        if(that.timer1){
          clearTimeout(that.timer1)
        }
        //that.timer1 = setTimeout(()=>{
        //  that.fetch();
        //},5*1000);
      }
    };
    store.handleNormal(param);
  }
  resetMap(e){
    this.setState({
      selectedSite:e.target.Qi.devname
    });
    for (let i = 0; i < markers.length; i++) {
      markers[i].setIcon(preIcon);
    }

    e.target.setIcon(clickIcon)
  }

  renderMarkerLayout(extData){
    //console.log(extData);
    //console.log(this);
    //if (extData.position.deveui === selectedMarker){
    //  return <div ><img src={ltIconActive} style={{width:'18px'}} /></div>
    //}
    return <div ><img  src={ltIcon} style={{width:'18px'}} /></div>
  }
  renderMarkerClick(extData){
    //this.setState({
    //  selectedMarker:extData.position.deveui
    //});
    return <div ><img src={ltIconActive} style={{width:'18px'}} /></div>
  }

  render() {
    const {selectedSite,markers}=this.state;
    return (
      <div className="midMap" style={{position:'relative'}}>
        {
          selectedSite!== '' ? <div className="defalultSite">当前站点：{selectedSite}</div>:''
        }
        <Map
             center={this.state.mapCenter}
             amapkey="34b4a85ed4cb72258bb55dc93dafddf7"
             mapStyle="amap://styles/a553e6e8ef5328bcb8d3534f1e2ca794"
             expandZoomRange
             useAMapUI
             zoom={10}
             zooms={[1, 20]}
             events={this.amapEvents}
        >
          <Markers
            //markers={this.state.markers}
            events={this.markerEvents}
            //render={this.renderMarkerLayout}


          />
          {/*<Polygon*/}
            {/*style={{*/}
              {/*//path: path,*/}
              {/*strokeColor: "#10FFDB",*/}
              {/*strokeWeight: 2,*/}
              {/*strokeOpacity: 0.8,*/}
              {/*fillOpacity: 0.08,*/}
              {/*fillColor: '#10FFDB',*/}
              {/*zIndex: 50,*/}
            {/*}}*/}
            {/*path={this.state.path}*/}

          {/*/>*/}
        </Map>

      </div>
    );
  }
}

export default PageComponent;


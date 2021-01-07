import React, { Component } from 'react';
import { Select } from 'antd';
import modal from 'components/modal/modal';
import './index.less';
import tabStore from 'store/tablestore';
import Piecircle2 from 'components/echart/piecircle2';
import BigimgFn from './bigImgModal';

import img1 from 'images/bg-main.jpg';
import img2 from 'images/login-bg.jpg';
import img3 from 'images/success-icon.png';

const store = new tabStore();
const { Option } = Select;
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryData:[]
    };
  }

  componentDidMount() {
    this.fetchSummary();
  }

  componentWillUnmount(){
    if(this.timer1){
      clearTimeout(this.timer1)
    }
  }

  fetchSummary() {
    const that = this;
    const param = {
      loadingFlag: false,
      url: '',
      method: 'get',
      data: {
        resid:window.resid
      },
      successFn(data) {
        that.setState({
          summaryData:data.data
        });

        if(that.timer1){
          clearTimeout(that.timer1)
        }
        that.timer1 = setTimeout(()=>{
          that.fetchSummary();
        },window.timer);
      }
    };
    store.handleNormal(param);
  }

  showBigImg = (Imgsrc) => {
    modal.showModel({
      type: 'dialog',
      title: '预览',
      width: '1024px',
      backgroundColor:'#2B2B2B',
      classname:'imgmodal',
      Dialog: BigimgFn,
      //ok: (value) => {
      //  const params = {
      //    loadingFlag: false,
      //    url: '/parking/spotcfg/mod',
      //    method: 'POST',
      //    data: {
      //      ...value
      //    },
      //    successFn() {
      //      that.fetch();
      //      // that.fetch({ filter: that.searchList.filter });
      //    }
      //  };
      //  //store.handleNormal(params);
      //},
      param: [img1,img2,img3]//Imgsrc
    });
  };


  handlemarkclick(deveui){
    this.fetch(deveui)
  }


  render() {
    const {summaryData}=this.state;
    return (
      <div className="picsPage" style={{height:'100%'}}>
        <div className="orderCont">
          {
            summaryData.map((item,index)=>{
              return (
                <div className="listOne" key={index}>
                  <img src={window.apiUrl+'/photoid?photoid='+item} onClick={this.showBigImg.bind(this,(window.apiUrl+'/photoid?photoid='+item))} className="listoneImg" />
              </div>)
            })
          }


          <div className="listOne">
            <img src={require('images/success-icon.png')} onClick={this.showBigImg} className="listoneImg" />
          </div>
          {/*<div className="listOne">*/}
            {/*<img src={require('images/videoImg.png')} onClick={this.showBigImg} className="listoneImg" />*/}
          {/*</div>*/}

        </div>
      </div>
    );
  }
}

export default PageComponent;

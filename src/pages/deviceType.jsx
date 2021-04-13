import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Carousel } from 'antd';
import tabStore from 'store/tablestore';

const store = new tabStore();
//@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);

  }

  handleClick(item,index2,index){
    this.setState({
      fatherCurrentIndex:index,
      currentIndex:index2
    });
    const {clickFn}=this.props;
    clickFn(item.devtype);
  }


  render() {
    const {pics}=this.state;
    var result = [];
    for(var i=0,len=pics.length;i<len;i+=14){
      result.push(pics.slice(i,i+14));
    }
    console.log(result);
    return (
      <div className="devType">
        <div className="liquidDev">
          <LiquidChar />
        </div>
        <div className="calPics">
          <Carousel autoplay={true}>
            {
              result.map((item,index)=>{
                const tempHtml= item.map((item2,index2)=>{
                  return (
                    <div className={currentIndex === index2 && index === fatherCurrentIndex ? 'listOne liseOneActive':'listOne'}key={index2} onClick={this.handleClick.bind(this,item2,index2,index)}>
                      <div className="tit">{item2.shortname}</div>
                      <div className="descVal"><img className="threeBarIcon" src={botIcon} alt="" />{item2.devnum}</div>
                    </div>
                  )
                });
                return (
                  <div key={index}>{tempHtml}</div>
                );

              })
            }

          </Carousel>
        </div>

      </div>
    );
  }
}

export default PageComponent;


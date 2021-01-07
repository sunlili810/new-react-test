import React, { Component,useEffect, useRef,useState } from 'react';
import { Carousel } from 'antd';
import {LeftOutlined,RightOutlined } from '@ant-design/icons';
import './index.less';


const bigimgFn = (props)=>{
  const imglist = useRef();
  const [imgindex, setImgindex]  = useState(0);
  //useEffect(() => {
  //  console.log(imglist.current)
  //}, [])
  const prevFn = ()=>{
    imglist.current.prev();
  }
  const nextFn = ()=>{
    imglist.current.next();
  }

  const onChange = (a, b, c)=>{
    console.log(a);
    setImgindex(a);
  }

  const contentStyle = {
    width:'70%',
    height: '768px',
    color: '#fff',
    //lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (<div style={{width:'100%',textAlign:'center',position:'relative',background:'#2B2B2B'}}>
    {
      imgindex=== 0 ? (
        <div onClick={nextFn} style={{position:'absolute',right:'-35px',top:'30%',color:'#B1B1B1',fontSize:'30px',zIndex:'999',cursor:'pointer'}}><RightOutlined /></div>
      ):
        imgindex!==0 &&  imgindex<props.param.length-1? (
          <div>
            <div onClick={nextFn} style={{position:'absolute',right:'-35px',top:'30%',color:'#B1B1B1',fontSize:'30px',zIndex:'999',cursor:'pointer'}}><RightOutlined /></div>
            <div onClick={prevFn} style={{position:'absolute',left:'-35px',top:'30%',color:'#B1B1B1',fontSize:'30px',zIndex:'999',cursor:'pointer'}}><LeftOutlined /></div>
          </div>
        ):
          imgindex===props.param.length-1?
        (<div onClick={prevFn} style={{position:'absolute',left:'-35px',top:'30%',color:'#B1B1B1',fontSize:'30px',zIndex:'999',cursor:'pointer'}}><LeftOutlined /></div>):''
    }

    {/*<img style={{width:'90%'}} src={props.param} />*/}
    <Carousel autoplay={false} ref={imglist} afterChange={onChange} dots={false} >

      {
        props.param.map((item,index)=>{
          return (<div style={contentStyle}><img key={index}  style={{width:'90%',maxHeight:'768px',margin:'0 auto'}} src={item} /></div>)
        })
      }

    </Carousel>
  </div>)
}



const prevFn = ()=>{
  let ref = createRef();
  console.log(ref);
  //this.refs.imglist.prev();
}
const nextFn = ()=>{
 // this.refs.imglist.next();
}

export default bigimgFn;

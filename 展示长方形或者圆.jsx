import React, {
  Component, useState, useEffect, useReducer, useRef
} from 'react';
import { Observer, useObserver } from 'mobx-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Modal, Row, Col, Form, Select, Input, Button
} from 'antd';
import tbstore from 'store/tablestoreUser';
import Panda from 'images/panda.png';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 22 },
  wrapperCol: { span: 22 }
};
let moveDownFlag = 0;
let scaleNum = 1;


function PageComponent(props) {
  const formRef = useRef();
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [fenceDetail, setFenceDetail] = useState(null);

  const creactRect = () => {
    const { tglobalObj } = tbstore.dataObj;
    const elem = canvasRef.current;
    const ctx = elem?.getContext('2d');
    ctx?.clearRect(0, 0, window.globalImg.width, window.globalImg.height);
    if (window?.globalImg) {
      ctx.drawImage(window.globalImg, 0, 0, window.globalImg.width * scaleNum, window.globalImg.height * scaleNum);
    }
    if (tglobalObj?.shapetype === 1) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      ctx.fillRect(tglobalObj.px || 0, tglobalObj.py || 0, tglobalObj.width * scaleNum, tglobalObj.height * scaleNum);
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      ctx.arc(tglobalObj.px || 0, tglobalObj.py || 0, 50 * scaleNum, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  };

  function drag(obj) {
    obj.onmousedown = function (event) {
      moveDownFlag = 1;
      console.log('mouseDown');
      // 设置box1捕获所有鼠标按下的事件
      /*
               * setCapture()
               *  - 只有IE支持，但是在火狐中调用时不会报错
               * 		而如果使用chrome调用，会报错
               */
      obj.setCapture && obj.setCapture();

      event = event || window.event;
      // div的偏移量，鼠标.clientX-元素.offsetLeft

      // div的偏移量，鼠标.clientY-元素.offsetTop

      const ol = event.clientX - obj.offsetLeft;

      const ot = event.clientY - obj.offsetTop;
      // 为document绑定一个onmousemove事件

      document.onmousemove = function (event) {
        console.log('move');
        event = event || window.event;
        // 当鼠标移动时被拖拽的元素跟随鼠标移动 onmousemove

        // 获取鼠标的坐标
        const left = event.clientX - ol;
        const top = event.clientY - ot;

        if (moveDownFlag === 1) {
          // 修改box1的位置
          obj.style.left = `${left}px`;
          obj.style.top = `${top}px`;
        }
      };

      // 为元素绑定一个鼠标松开事件
      document.onmouseup = function () {
        // 当鼠标松开时，被拖拽元素固定在当前位置 onmouseup
        // 取消document的onmousemove事件

        document.onmousemove = null;
        document.onmouseup = null;
        moveDownFlag = 0;
        console.log('mouseup');
        // 当鼠标松开时，取消对事件的捕获
        obj.releaseCapture && obj.releaseCapture();
      };
      /*
               * 当我们拖拽一个网页的内容时，浏览器会默认去搜索引擎中搜索内容
               *   此时会导致拖拽功能的异常，这是浏览器提供的默认行为
               * 	 如果不希望发生这个行为，则可以通过return false来取消默认行为
               */
      return false;
    };
  }
  const scrollFunc = function (e) {
    e = e || window.event;
    if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
      if (e.wheelDelta > 0) { // 当滑轮向上滚动时
        // alert('上滚');
        scaleNum += 0.1;
      }
      if (e.wheelDelta < 0) { // 当滑轮向下滚动时
        // alert('下滚');
        scaleNum -= 0.1;
      }
    } else if (e.detail) { // Firefox滑轮事件
      if (e.detail > 0) { // 当滑轮向下滚动时
        // alert('下滚');
        scaleNum -= 0.1;
      }
      if (e.detail < 0) { // 当滑轮向上滚动时
        // alert('上滚');
        scaleNum += 0.1;
      }
    }
    creactRect();
  };

  // useEffect(() => {
  //   if (props?.selectedRow?.type === 'area') {
  //     loadImg();
  //     window.onmousewheel = document.onmousewheel = scrollFunc;
  //   }
  // }, [props?.selectedRow?.key]);
  useEffect(() => {
 querybyzoneid();
      queryZoneArea();
      loadImg();
      window.onmousewheel = document.onmousewheel = scrollFunc;
  }, []);

  const loadImg = () => {
    const elem = canvasRef.current;

    const canvas = elem?.getContext('2d');

    window.globalImg = new window.Image();
    window.globalImg.src = Panda;// Panda imgSrc

    // 加载背景图片
    window.globalImg.onload = () => {
      elem.height = window.globalImg.height;
      elem.width = window.globalImg.width;
      canvas.drawImage(window.globalImg, 0, 0);

      const img01 = document.getElementById('myCanvasWrap');
      drag(img01);
      // creactRect();
      // let bg = canvas.createPattern(img,"no-repeat");     //方法指定的方向内重复指定的元素
      // canvas.fillStyle = bg;  //属性设置或返回用于填充的颜色，渐变或模式
      // canvas.fillRect(canvasX,canvasY,canvasWidth,canvasHeight);    //绘制以填充矩形（左上角x，左上角y，宽，高）
    };
  };

  const querybyzoneid = () => {
    const param = {
      loadingFlag: false,
      url: 'test',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        zoneid: props?.selectedRow?.zoneid
      },
      successFn(data) {
        setImgSrc(window.location.origin + window.routername + data.data?.[0]?.filepath);
        // formRef.current.setFieldsValue({ zoneId: tempData?.[0]?.value });
        // imgSrc: window.location.origin + window.routername + data.data?.[0]?.filepath
      }
    };
    tbstore.handleNormal(param);
  };

  const queryZoneArea = () => {
    const param = {
      loadingFlag: false,
      url: 'locm/inmonitor/fence/areas/zoneid',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        fenceid: props?.selectedRow?.fencid,
        zoneid: props?.selectedRow?.zoneid
      },
      successFn(data) {
        tbstore.dataObj.tglobalObj = data?.data?.[0];
        creactRect();
      }
    };
    tbstore.handleNormal(param);
  };

  // const queryZoneArea = () => new Promise((resolve, reject) => {
  //   const param = {
  //     loadingFlag: false,
  //     url: 'test',
  //     method: 'POST',
  //     data: {
  //       projectid: localStorage.getItem('projectId'),
  //       fenceid: props?.selectedRow?.fencid,
  //       zoneid: props?.selectedRow?.zoneid
  //     },
  //     successFn(data) {
  //       resolve(data?.data?.[0]);
  //     }
  //   };
  //   tbstore.handleNormal(param);
  // });
  const queryFenceDetail = () => {
    const param = {
      loadingFlag: false,
      url: 'testurl',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        fenceid: props?.selectedRow?.fencid
      },
      successFn(data) {
        setFenceDetail(data.data);
      }
    };
    tbstore.handleNormal(param);
  };

  return (
    <div id="containerDiv" style={{ position: 'relative', height: '550px', overflow: 'hidden' }}>

 <div id="myCanvasWrap" style={{ position: 'absolute' }}>
      <canvas id="myCanvas" className="canvas_box" ref={canvasRef} width={550} height={500} />
    </div>

    </div>
  );
}
export default observer(PageComponent);

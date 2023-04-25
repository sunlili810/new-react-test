import React, {
  Component, useState, useEffect, useReducer, useCallback, useRef
} from 'react';
import Panda from 'images/panda.png';
import DisplayCoord from 'components/mouseCoord/mouseCoord.js';

import {
  Form, Input, Button
} from 'antd';

function PageComponent(props) {
  useEffect(() => {
    const img01 = document.getElementById('draggleDiv');
    drag(img01);
  }, []);

  /*
           * 提取一个专门用来设置拖拽的函数
           * 参数，开启拖拽的元素
           */

  function drag(obj) {
    obj.onmousedown = function (event) {
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
        event = event || window.event;
        // 当鼠标移动时被拖拽的元素跟随鼠标移动 onmousemove

        // 获取鼠标的坐标
        const left = event.clientX - ol;
        const top = event.clientY - ot;

        // 修改box1的位置
        obj.style.left = `${left}px`;
        obj.style.top = `${top}px`;
      };

      // 为元素绑定一个鼠标松开事件
      document.onmouseup = function () {
        // 当鼠标松开时，被拖拽元素固定在当前位置 onmouseup
        // 取消document的onmousemove事件

        document.onmousemove = null;
        document.onmouseup = null;
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
  const handleDbClick = () => {
    // document.getElementById('mp_x').innerHTML document.getElementById('mp_y').innerHTML

    props.onTrigger('okBtn', { x: document.getElementById('mp_x').innerHTML, y: document.getElementById('mp_y').innerHTML });
  };
  const tempX=`${props.param.xCoord}` || `${props.param.rowData?.[`locx${props.param.tempIndex}`]}`;

  return (
    <div
      className="imgWrap"
      id="imgDiv"
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      <div id="draggleDiv" style={{ position: 'absolute' }}>

        <img id="imgWrap" src={props.param.imgSrc} onMouseMove={DisplayCoord} style={{ position: 'absolute' }} onDoubleClick={handleDbClick} />
        <div
          className="absolute "
          style={{
            left: `${props.param.xCoord}px` || `${props.param.rowData?.[`locx${props.param.tempIndex}`]}px`,
            top: `${props.param.yCoord}px` || `${props.param.rowData?.[`locy${props.param.tempIndex}`]}px`,
            // left: '0px',
            // top: '10px',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: 'red',
            display:tempX!==null&&tempX!=='undefined'?'inline-block':'none'
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '-4px',
          left: '10px'
        }}
      >当前坐标：<span id="mp_x" />,<span id="mp_y" />
        <div className="text-blue-2">  <i className="fa fa-commenting-o mr-3" />注：请在地图上双击鼠标拾取坐标</div>
      </div>
    </div>
  );
}
export default PageComponent;

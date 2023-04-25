import React, {
  Component, useState, useEffect, useReducer, useRef
} from 'react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import { Observer, useObserver } from 'mobx-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Table, Modal, Row, Col, Divider, Pagination, Form, Select, Input, Button
} from 'antd';
import tbstore from 'store/tablestoreUser';
// import {
//   Stage, Layer, Image, Rect, Circle
// } from 'react-konva';
import useImage from 'use-image';
import Panda from 'images/panda.png';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};
let moveDownFlag = 0;

function PageComponent(props) {
  const [tool, setTool] = useState('rect');
  const [tpos, setTpos] = useState();
  const [tpos2, setTpos2] = useState();
  const isDrawing = useRef(false);
  const formRef = useRef();
  const [draggablec, setDraggablec] = useState(true);
  const canvasRef = useRef(null);
  const [shapeType, setShapeType] = useState(1);
  const [imgSrc, setImgSrc] = useState('');


  const handleMouseDown = (ev) => {
    isDrawing.current = true;

    const mx = ev.clientX; // 相对于document的位置
    const my = ev.clientY;

    const rect = canvasRef.current.getBoundingClientRect(); // 这里无需再考虑margin
    const dx = mx - rect.left;
    const dy = my - rect.top;

    // const pos = ev.target.getStage().getPointerPosition();
    // setTpos(pos);
    // setTpos2(pos);
    setTpos({ x: dx, y: dy });

    const img01 = document.getElementById('myCanvasWrap');
    if (draggablec) {
      drag(img01);
    } else {
      document.onmousemove = null;
      document.onmouseup = null;
      // 当鼠标松开时，取消对事件的捕获
      img01.releaseCapture && img01.releaseCapture();
    }
  };

  const handleMouseMove = (ev) => {
    // no drawing - skipping
    // if (!isDrawing.current) {
    //   return;
    // }
    // const pos = e.target.getStage().getPointerPosition();

    // // console.log("offset===" + e.evt.offsetX);
    // console.log(`pos===${pos.x}`);

    // setTpos2(pos);

    const mx = ev.clientX; // 相对于document的位置
    const my = ev.clientY;

    const rect = canvasRef.current.getBoundingClientRect(); // 这里无需再考虑margin
    const dx = mx - rect.left;
    const dy = my - rect.top;
    setTpos2({ x: dx, y: dy });

    if (isDrawing.current) {
      const elem = canvasRef.current;
      const ctx = elem.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (window.globalImg) {
        ctx.drawImage(window.globalImg, 0, 0);
      }
      if (shapeType === 1) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        const tempx = dx - tpos.x <= 0 ? 0 : dx - tpos.x;
        const tempy = dy - tpos.y <= 0 ? 0 : dy - tpos.y;
        ctx.fillRect(tpos.x, tpos.y, tempx, tempy);
        ctx.closePath();

        formRef.current.setFieldsValue({
          x: parseInt((dx - tpos?.x) / 2) || 0,
          y: parseInt((dy - tpos?.y) / 2) || 0,
          width: parseInt(dx - tpos?.x) || 0,
          height: parseInt(dy - tpos?.y) || 0
        });
      } else {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        const tempx = dx - tpos.x <= 0 ? 0 : dx - tpos.x;
        ctx.arc(tpos.x, tpos.y, tempx / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        formRef.current.setFieldsValue({
          x: parseInt(tpos?.x) || 0,
          y: parseInt(tpos?.y) || 0,
          height: parseInt(tempx / 2) || 0
        });
      }
    }
  };

  const handleMouseUp = (e) => {
    isDrawing.current = false;
  };
  function drag(obj) {
    // draggablec
    if (!draggablec) {
      return;
    }
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
  const handleOk = (values) => {
    // const data = {
    //     ...values,
    //     rolem_form_op:state.flag,
    //     rolem_form_roletype:2,
    //     //rolem_form_roleid:1,
    //
    // };
    // props.onTrigger('okBtn', data);

    const param = {
      loadingFlag: false,
      url: 'test',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        ...values

      },
      successFn(data) {
      

        // tabRef.current && tabRef.current.doQuery();
        // dispatch({ type: 'setFormDisable', value: true });
      }
    };
    tbstore.handleNormal(param);
  };

  useEffect(() => {
    loadImg();
    querybyzoneid(props.zoneList?.[0]?.value);
  }, []);

  const loadImg = () => {
    const elem = canvasRef.current;

    const canvas = elem.getContext('2d');

    window.globalImg = new window.Image();
    window.globalImg.src = imgSrc;// Panda

    // 加载背景图片
    window.globalImg.onload = () => {
      elem.height = window.globalImg.height;
      elem.width = window.globalImg.width;
      canvas.drawImage(window.globalImg, 0, 0);
      // let bg = canvas.createPattern(img,"no-repeat");     //方法指定的方向内重复指定的元素
      // canvas.fillStyle = bg;  //属性设置或返回用于填充的颜色，渐变或模式
      // canvas.fillRect(canvasX,canvasY,canvasWidth,canvasHeight);    //绘制以填充矩形（左上角x，左上角y，宽，高）
    };
  };

  function LionImage() {
    const [image] = useImage(Panda);
    return <Image image={image} />;
  }

  const tempRiveise = [];
  for (let i = -100; i <= 100; i += 10) {
    tempRiveise.push({
      value: i,
      label: i
    });
  }
  const handleShape = (value) => {

  };
  const querybyzoneid = (zoneid) => {
    const param = {
      loadingFlag: false,
      url: 'test',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        zoneid
      },
      successFn(data) {
        setImgSrc(window.location.origin + window.routername + data.data?.[0]?.filepath);
        // formRef.current.setFieldsValue({ zoneId: tempData?.[0]?.value });
        // imgSrc: window.location.origin + window.routername + data.data?.[0]?.filepath
      }
    };
    tbstore.handleNormal(param);
  };


  return (
    <div id="containerDiv" style={{ position: 'relative', height: '80vh', overflow: 'hidden' }}>

      <div id="myCanvasWrap" style={{ position: 'absolute' }}>
        <canvas id="myCanvas" className="canvas_box" ref={canvasRef} width={500} height={500} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
      </div>
      {/* <Stage
        width="1066"
        height="800"
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        draggable={draggablec}
        ref={canvasRef}
      >
        <Layer>

          <LionImage />

          {tool === 'rect' ? (
            <Rect
              x={tpos?.x}
              y={tpos?.y}
              width={tpos2?.x - tpos?.x}
              height={tpos2?.y - tpos?.y}
              fill="#df4b26"
              shadowBlur={10}
            />
          ) : (
            <Circle
              x={tpos?.x}
              y={tpos?.y}

              radius={
                (tpos2?.x - tpos?.x) / 2 <= 0 ? 0 : (tpos2?.x - tpos?.x) / 2
              }
              fill="#df4b26"
              // onDragEnd={() => {
              //   setColor(Konva.Util.getRandomColor());
              // }}
            />
          )}

        </Layer>
      </Stage> */}

    </div>
  );
}
export default observer(PageComponent);

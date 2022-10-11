import React, {
  Component, useState, useEffect, useReducer, useCallback, useContext
} from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
// import TableStore from 'store/tablestore';
// import { Unity, useUnityContext } from 'react-unity-webgl';
import Unity, { UnityContext } from 'react-unity-webgl';
import store from 'store/glstore';
import loadingIcon from 'images/loading.gif';

const initialState = {
  testData: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'warningData':
      return { ...state, testData: action.value };
    default:
      throw new Error();
  }
}
// let timer;Unity打包好的文件放在public文件夹下面

const unityContext = new UnityContext({
  loaderUrl: '../Build/ZGZ_WebGl2022092805.loader.js',
  dataUrl: '../Build/ZGZ_WebGl2022092805.data',
  frameworkUrl: '../Build/ZGZ_WebGl2022092805.framework.js',
  codeUrl: '../Build/ZGZ_WebGl2022092805.wasm'
});
function PageComponent(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { navigator } = useContext(NavigationContext);
  const [isLoaded, setIsLoaded] = useState(false);

  const [iframeVisableMessagePub, setIframeVisableMessagePub] = useState(false);

  // unityContext.setFullscreen(true);

  const handleIframePostMessage = (str) => {
    if (str.data.type === 'exit') {
      handleHideIframe();
      setIframeVisableElectronic(false);
      setIframeVisableMessage(false);
      setIframeVisableMessagePub(false);
    } else if (str.data.type === 'track') {//前端向Unity发送查询数据
      unityContext.send('UnityToWebMsg', 'ReceiveMessage', `${str.data.data}`);
    }
  };
  const handleClickFn = () => {
    console.log(5555555555555555);
    // unityContext.send('UnityToWebMsg', 'ReceiveMessage', 'Receive : Jtro !');
  };
  const handleGameOver = useCallback((str) => {
    // 监听Unity点击事件展示相应的前端逻辑 showDetail();
    console.log(str);
  }, []);

  useEffect(() => {
	  //向Unity传送
    unityContext.send('UnityToWebMsg', 'ReceiveMessage', `Token_${localStorage.getItem('token')}`);//三个参数分别为Unity容器名称、Unity方法名称、传人数据
    addEventListener('SendJSMessage', handleGameOver);
    window.addEventListener('message', handleIframePostMessage);

    const unityDom = document.getElementsByClassName('my-unity-app');
    unityDom?.[0].addEventListener('click', handleClickFn);

    return () => {
      removeEventListener('UnityToWebMsg', handleGameOver);
      removeEventListener('message', handleIframePostMessage);
    };
  }, [addEventListener, removeEventListener, handleGameOver, store.dataObj.hRad1]);

//为了退出Unity再进入销毁

  useEffect(() => {
    unityContext.on('loaded', () => {
      setIsLoaded(true);
    });

    const unblock = navigator.block(async (tx) => {
      if (showFlag) {
        await unityContext.quitUnityInstance();
        await setShowFlag(false);
        tx.retry();
      } else {
        unblock();
        tx.retry();
      }
    });
    return unblock;
  }, [navigator, showFlag]);

  
  function btn() {
    // sendMessage('Canvas', 'Receive', 'Receive : Jtro !');
    // unityContext.send('UnityToWebMsg', 'ReceiveMessage', 'Receive : Jtro !');
  }
  return (
    <div className="webglWrap" style={{ width: '100%', height: '100%' }}>
      {/* <Unity style={{ width: '800px', height: '500px' }} unityProvider={unityProvider} /> */}
      {
            showFlag ? (
              <div style={{ width: '100%', height: '100%' }}>
                <div style={{

                  display: isLoaded ? 'none' : 'flex', width: '100%', height: '100%', background: '#41689E', alignItems: 'center', alignContent: 'center', justifyContent: 'center'
                }}
                >
                  <div style={{
                    width: '225px', height: '60px', lineHeight: '60px', padding: '0 15px', borderRadius: '5px', background: 'rgba(36,36,36,0.95)', color: '#fff'
                  }}
                  ><img src={loadingIcon} alt="" /> &nbsp;模型加载中，请稍后...
                  </div>
                </div>
                <Unity className="my-unity-app" style={{ width: '100%', height: '100%' }} unityContext={unityContext} />
              </div>
            ) : ''
        }

      {/* <Button type="primary" onClick={btn}>点击</Button> */}

    </div>
  );
}
export default observer(PageComponent);

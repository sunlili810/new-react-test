import React, { useState, useEffect } from 'react';
import tabStore from 'store/tablestore';

const store = new tabStore();

function hoverrender(props) {
  const [list, setList] = useState();
  useEffect(() => {
    function fetchTreeData() {
      const param = {
        loadingFlag: false,
        url: '',
        method: 'post',
        data: {
          resid: props.lightdev
        },
        successFn(data) {
          setList({
            devname: data[`${props.type}`]?.[0]?.info?.devname,
            deveui: data[`${props.type}`]?.[0]?.info?.deveui,
            light: props.lightdevname,
            status: data[`${props.type}`]?.[0]?.meas?.status
          });
        }
      };
      store.handleNormal(param);
    }
    fetchTreeData();
  }, [props.lightdev]);
  return (
    <div className="markoutWrap" style={{ position: 'relative' }}>

      <div className="markhCont">
        {
              props.type === 'lightonly' ? (
                <div>
                  
                  <div className='listone'>测试{props?.lightdev}</div>
                </div>

              ) : (
                <div>
                 
               
                  <div className='listone'>测试：
                    {list?.status === 1 || list?.status === '1' ? '正常' : list?.status === 0 || list?.status === '0' ? '异常' : ''}
                  </div>
                </div>
              )
          }

      </div>
    </div>
  );
}


export default hoverrender;

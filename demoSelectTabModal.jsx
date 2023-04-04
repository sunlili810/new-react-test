import React, {
  Component, useState, useEffect, useReducer
} from 'react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import { Observer, useObserver } from 'mobx-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Table, Modal, Row, Col, Divider, Pagination, Button
} from 'antd';
import TableStore from 'store/tablestoreUser';



const store = TableStore;
const initialState = {
  selectedRowKeys: [],
  selectedRows: [],
  treeData: [],
  searchFilter: null,
  projectList: [],
  tempRId: null
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
    case 'setProjectList':
      return { ...state, projectList: action.value };
    case 'setTempRId':
      return { ...state, tempRId: action.value };
    default:
      throw new Error();
  }
}

function PageComponent(props) {
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(100);
  const [state, dispatch] = useReducer(reducer, initialState);

  const cancelClickHandler = () => {
    props.onTrigger('cancelBtn');
  };

  function doQuery(params = {}) {
    const { searchFilter } = state;
    const param = {
      loadingFlag: false,
      url: '',
      method: 'post',
      data: {
        projectid: localStorage.getItem('projectId'),
        batch: store.dataObj.pagination.pageSize,
        page: store.dataObj.pagination.current,
        ...searchFilter,
        ...params
      }
      // successFn(data) {
      //   const tmepList = data.data?.pList?.map((item, index) => ({
      //     ...item,
      //     key: index + 1
      //   }));
      //   dispatch({ type: 'setProjectList', value: tmepList });
      // }
    };
    store.fetchTabData(param);
    // store.handleNormal(param);
  }
  useEffect(() => {
    doQuery();
  }, [store.dataObj.pagination.current, state.searchFilter]);

  function searchFn(value) {
    store.dataObj.pagination.current = 1;
    dispatch({
      type: 'searchFilter',
      searchFilter: value
    });
    // this.setState({ searchFilter: value }, () => {
    //   doQuery();
    // });
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'selectedRowKeysselectedRows',
      selectedRowKeys,
      selectedRows
    });
    // this.setState({ selectedRowKeys, selectedRows });
  }

  function handleTableChange(pagination, filter, sorter) {
    store.dataObj.pagination.current = pagination.current;
    store.dataObj.pagination.pageSize = pagination.pageSize;
  }

  const handlePagChange = (page) => {
    console.log(page);
    setCurrent(page);
  };
  const onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize);
    setPagesize(pageSize);
  };
  const handleSelect = (record) => {
    // console.log(record);
    // cancelClickHandler();
    // props.onTrigger('okBtn', record);
    dispatch({ type: 'setTempRId', value: record });
  };

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange
  };
  const columns = [
    {
      title: '',
      dataIndex: '',
      key: ''
    },
    {
      title: '',
      dataIndex: '',
      key: ''
    }
  ];
  const handleOkFn = () => {
    // props.onTrigger('okBtn', state.tempRId);

    const param = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        projectid: localStorage.getItem('projectId'),
        zoneGrp: props?.param?.agid,
        btIdArr: state.selectedRowKeys.toString()

      },
      successFn(data) {
     
        props.onTrigger('okBtn', '');
        // treeRef.current && treeRef.current.fetchTreeListFn();
      }
    };
    store.handleNormal(param);
  };

  // const dataSource = store.dataObj.list.slice();
  // const tempLists = state.projectList.slice((current-1)*pagesize,current*pagesize);

  return (
    <>
      <Table
                // rowSelection={rowSelection}
        columns={columns}
        dataSource={store.dataObj.list.slice()}
        pagination={store.dataObj.pagination}
        onChange={handleTableChange}
                 // scroll={{ x: 2710, y: 'calc(80vh - 140px)' }}
        scroll={{ y: 360 }}
        size="middle"
        bordered
        loading={false}
        onRow={(record) => ({
          onClick: (event) => { handleSelect(record); }
        })}
        rowClassName={((record) => (record.appeui === state.tempRId?.appeui ? 'ant-table-row-selected' : ''))} // <=== here
      />
      {/* <Pagination */}
      {/*    current={current} */}
      {/*    onChange={handlePagChange} */}
      {/*    total= {state.projectList.length} //{tempSource.pList.length} */}
      {/*    showSizeChanger */}
      {/*    onShowSizeChange={onShowSizeChange} */}
      {/*    defaultPageSize={pagesize} */}
      {/*    className=" mt-3 text-right" */}
      {/*    style={{marginTop:'10px'}} */}
      {/* /> */}
      <div className="text-right mt-3">
        <Button type="primary" size="middle" onClick={handleOkFn}>确定</Button>
        <Button type="primary" size="middle" className="ml-3" onClick={cancelClickHandler}>取消</Button>
      </div>
    </>
  );
}
export default observer(PageComponent);

import React, {
  Component, useState, useEffect, useReducer
} from 'react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import { Observer, useObserver, useLocalStore } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
import {
  Table, Modal, Row, Col, Divider
} from 'antd';
import TableStore from 'store/tablestore';
import TableConfig from './tableConfig';
import TabHead from './tabhead';
import './index.less';
import Lefttree from '../leftTree';
import useTableList from './indexCom';

const tableStore = new TableStore();
const initialState = {
  selectedRowKeys: [],
  selectedRows: [],
  treeData: [],
  searchFilter: null,
  placelist: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'selectedRowKeys':
      return { selectedRowKeys: action.selectedRowKeys };
    case 'searchFilter':
      return { searchFilter: action.searchFilter };
    case 'selectedRowKeysselectedRows':
      return { selectedRowKeys: action.selectedRowKeys, selectedRows: action.selectedRows };
    case 'fetchtreedata':
      return { treeData: action.data };
    default:
      throw new Error();
  }
}

function PageComponent(props) {
  const store = useLocalStore(() => tableStore);
  const {
    pagination, handleTableChange, rowSelection, searchFilter, dataSource, searchFn, doQuery
  } = useTableList('inficombo/appext/doorguard/doorguardperson/querydoorgudper2');
  const [state, dispatch] = useReducer(reducer, initialState);
  // function doQuery(params = {}) {
  //   const { searchFilter } = state;
  //   const param = {
  //     loadingFlag: false,
  //     url: 'inficombo/appext/doorguard/doorguardperson/querydoorgudper2',
  //     method: 'post',
  //     data: {
  //       numPerpage: store.dataObj.pagination.pageSize,
  //       page: store.dataObj.pagination.current,
  //       filter: searchFilter,
  //       ...params
  //     }
  //   };
  //   store.fetchTable(param);
  // }



  function addLine() {
    const that = this;
    const { placelist, organlist } = state;
    modal.showModel({
      type: 'dialog',
      title: '新增人员',
      width: '900px',
      Dialog: TableConfig,
      ok: (value) => {
        const params = {
          loadingFlag: false,
          url: '',
          method: 'POST',
          data: value.table,
          successFn() {
            doQuery();
            // fetchPlaceList();
          }
        };
        store.doUploadFiles(params);
      },
      param: {
        placelist,
        organlist
      }
    });
  }

  function editLine(text, record) {
    const that = this;
    const { placelist, organlist } = state;
    modal.showModel({
      type: 'dialog',
      title: '编辑人员配置',
      width: '800px',
      Dialog: TableConfig,
      ok: (value) => {
        const params = {
          loadingFlag: false,
          url: '',
          method: 'post',
          data: value.table,
          successFn() {
            doQuery();
            // fetchPlaceList();
          }
        };
        store.doUploadFiles(params);
      },
      param: {
        // modalData: {
        //   placelist
        // },
        placelist,
        organlist,
        ...record
        // age: record.age !== 0 ? record.age : ''
      }
    });
  }

  function deleteLine(text, record) {
    const that = this;
    const param = {
      url: '',
      method: 'post',
      data: {
        personids: record.personid
      },
      successFn() {
        // that.setState({ selectedRowKeys: [] });
        dispatch({ type: 'selectedRowKeys', selectedRowKeys: [] });
        doQuery();
        // fetchPlaceList();
      }
    };
    modal.showModel({
      type: 'confirm',
      message: '确认删除吗？',
      ok: (value) => {
        store.deleteLine(param);
      }
    });
  }

  function deleteLines() {
    const that = this;
    if (state.selectedRows.length === 0) {
      modal.showModel({
        type: 'confirm',
        message: '请选择删除项！',
        ok: () => {
        }
      });
    } else {
      // const numbers = Array.from(this.state.selectedRows, x => x.personid);
      const numbers = [];
      state.selectedRows.map((item) => {
        numbers.push(item.personid);
      });
      const str = numbers.join(',');
      const param = {
        url: '',
        method: 'post',
        data: {
          personids: str
        },
        successFn() {
          // that.setState({ selectedRowKeys: [] });
          dispatch({ type: 'selectedRowKeys', selectedRowKeys: [] });
          doQuery();
          // fetchPlaceList();
        }
      };
      modal.showModel({
        type: 'confirm',
        message: '确认删除吗？',
        ok: () => {
          store.deleteLine(param);
        }
      });
    }
  }
  function startFn(text, record) {
    const param = {
      url: '',
      method: 'post',
      data: {

      },
      successFn(data) {
        doQuery();
      }
    };
    store.handleNormal(param);
    // modal.showModel({
    //   type: 'confirm',
    //   message: '确认删除吗？',
    //   ok: (value) => {
    //     store.deleteLine(param);
    //   }
    // });
  }
  function closeFn(text, record) {
    const param = {
      url: '',
      method: 'post',
      data: {

      },
      successFn(data) {
        doQuery();
      }
    };
    store.handleNormal(param);
  }

  // function searchFn(value) {
  //   store.dataObj.pagination.current = 1;
  //   dispatch({
  //     type: 'searchFilter',
  //     searchFilter: value,
  //     fn: doQuery()
  //   });
  //   // this.setState({ searchFilter: value }, () => {
  //   //   doQuery();
  //   // });
  // }

  // function onSelectChange(selectedRowKeys, selectedRows) {
  //   dispatch({
  //     type: 'selectedRowKeysselectedRows',
  //     selectedRowKeys,
  //     selectedRows
  //   });
  //   // this.setState({ selectedRowKeys, selectedRows });
  // }

  // function handleTableChange(pagination, filter, sorter) {
  //   store.dataObj.pagination.current = pagination.current;
  //   store.dataObj.pagination.pageSize = pagination.pageSize;
  //   doQuery();
  // }

  // const rowSelection = {
  //   selectedRowKeys: state.selectedRowKeys,
  //   onChange: onSelectChange
  // };
  const columns = [
    {
      title: '操作',
      key: 'action',
      width: 150,
      // fixed: 'right',
      render: (text, record, index) => (
        <span>
          {/* <a onClick={() => { }}>详情</a> */}
          {/* <span className="ant-divider" /> */}
          <a onClick={() => { startFn(text, record, index); }}>启动</a>
          <Divider type="vertical" />
          <a onClick={() => { closeFn(text, record, index); }}>关闭</a>
          <Divider type="vertical" />
          <a onClick={() => { deleteLine(text, record, index); }}>删除</a>
        </span>
      )
    }
  ];
  // const dataSource = store.dataObj.list.slice();

  return (
    <Observer>{() => (
      <Layout name="people">
        <Row style={{ height: '100%' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ height: '100%' }}>
            <div className="people">
              <div className="container-out">
                <div className="nav-right">
                  {/* <Tabupload importFn={this.doQuery} /> */}
                  <TabHead addLine={addLine} deleteLines={deleteLines} searchFn={searchFn} />
                </div>
              </div>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                onChange={handleTableChange}
                // scroll={{ x: 2710, y: 'calc(80vh - 140px)' }}
                bordered
              />
            </div>
          </Col>
        </Row>

      </Layout>
    )}
    </Observer>
  );
}
export default PageComponent;

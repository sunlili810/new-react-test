import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import tabstore from 'store/tablestore';
import {
  Table, Modal
} from 'antd';
import modalConfig from './modalConfig';
import TabHead from './tabHead';
import './index.less';

const store = new tabstore();
@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFilter: null,
      selectedRowKeys: [],
      selectedRows: []
    };
    this.loadingDialog = null;
    this.instance = null;
    this.columns = [{
      title: '标识1',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '名称1',
      dataIndex: 'name',
      key: 'name'
    }
    // {
    //  title: '操作',
    //  dataIndex: 'key',
    //  key: 'key',
    //  width: 150,
    //  fixed: 'right',
    //  render: (text, record, index) => (
    //    <span>
    //      <a onClick={() => { this.showEdit(text, record, index); }}>编辑</a>
    //      <span className="ant-divider" />
    //      <a onClick={() => { this.deletUser(text, record, index); }}>删除</a>
    //    </span>
    //  )
    // }
    ];
  }

  componentDidMount() {
    // this.fetch();
  }

  fetch = (params = {}) => {
    const { searchFilter } = this.state;
    const queryParam = {
      loadingFlag: false,
      url: 'parking/charing/list',
      method: 'post',
      data: {
        numPerPage: 100,
        page: store.dataObj.pagination.current,
        filter: searchFilter,
        ...params
      }
    };
    store.fetchTabData(queryParam);
  };

  handleTableChange = (pagination, filters, sorter) => {
    store.dataObj.pagination.current = pagination.current;
    store.dataObj.pagination.pageSize = pagination.pageSize;
    this.fetch(sorter.field === undefined ? {} : {
      sort: [{
        name: sorter.field,
        sort: sorter.order === 'ascend' ? 'asc' : 'desc'
      }]
    });
  };

  addUser = () => {
    const that = this;
    modal.showModel({
      type: 'dialog',
      title: '新增',
      width: '750px',
      Dialog: modalConfig,
      ok: (value) => {
        const params = {
          loadingFlag: false,
          url: 'emsapi/v1/sgwconfig/add',
          method: 'POST',
          data: {
            ...value
          },
          successFn() {
            that.fetch();
          }
        };
        store.handleNormal(params);
      },
      param: {
        // ipaddr: '12.13.14.15',
        modalData: {
          // applicationlist: selectListData.applicationlist,
          // companylist: selectListData.companylist,
        }
      }
    });
  };

  showEdit = (text, record) => {
    const that = this;
    modal.showModel({
      type: 'dialog',
      title: '编辑',
      width: '750px',
      Dialog: modalConfig,
      ok: (value) => {
        const params = {
          loadingFlag: false,
          url: 'emsapi/v1/sgwconfig/mod',
          method: 'POST',
          data: {
            ...value
          },
          successFn() {
            that.fetch();
            // that.fetch({ filter: that.searchList.filter });
          }
        };
        store.handleNormal(params);
      },
      param: {
        ...record
      }
    });
  };

  deletUser = (text, record) => {
    const that = this;
    const param = {
      url: 'emsapi/v1/sgwconfig/del',
      method: 'POST',
      data: {
        id: record.id
      },
      successFn() {
        that.fetch();
        that.setState({ selectedRowKeys: [] });
      }
    };
    modal.showModel({
      type: 'confirm',
      message: '确认删除吗？',
      ok: () => {
        store.handleNormal(param);
      }
    });
  };

  deletMany = () => {
    const that = this;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      Modal.warning({
        title: '请选择删除项'
      });
    } else {
      const tempArry = Array.from(selectedRows, (x) => x.id);
      const param = {
        url: 'emsapi/v1/sgwconfig/del',
        method: 'POST',
        data: {
          id: tempArry
        },
        successFn() {
          that.fetch();
          that.setState({ selectedRowKeys: [] });
        }
      };
      modal.showModel({
        type: 'confirm',
        message: '确认删除吗？',
        ok: () => {
          store.handleNormal(param);
        }
      });
    }
  };

  searchFn = (value) => {
    store.dataObj.pagination.current = 1;
    this.setState({
      searchFilter: {
        ...value
      }
    }, () => {
      this.fetch();
    });
  };

  onSelectChange = (record, selected, selectedRows) => {
    this.setState({ selectedRowKeys: record, selectedRows: selected });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const datasorce = store.dataObj.list.slice();
    const tempDataList = Array.from(datasorce, (item) => ({
      ...item,
      statusDesc: item.status === 'offline' ? '离线' : '在线'
    }));
    return (
      <Layout name="sgw">
        <div className="sgw">
          <div className="container-out">

            {/* <div className="nav-right"> */}
            {/* <TabHead addUser={this.addUser} deletMany={this.deletMany} searchFn={this.searchFn} param={[]} /> */}
            {/* </div> */}
            <Table
              className="deviceConfigTab"
              columns={this.columns}
              bordered
              dataSource={tempDataList}
              pagination={store.dataObj.pagination}
              // scroll={{ x: 2400, y: 'calc(80vh - 140px)' }}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </Layout>
    );
  }
}
export default PageComponent;

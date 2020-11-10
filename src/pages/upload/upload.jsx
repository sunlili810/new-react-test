import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import tabstore from 'store/tablestore';

import {
  Table, Modal, Divider
} from 'antd';
import modalConfig from './modalConfig';
import modalConfigEdit from './modalConfigEdit';
import TabHead from './tabHead';
import './upload.less';
import previewPic from './previewPicModal';

const store = new tabstore();
@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placelist: [],
      searchFilter: null,
      selectedRowKeys: [],
      selectedRows: [],
      siteList: []
    };
    this.loadingDialog = null;
    this.instance = null;
    this.columns = [{
      title: '地点',
      dataIndex: 'exemplaryName',
      key: 'exemplaryName'
    }, {
      title: '时间',
      dataIndex: 'shootTime',
      key: 'shootTime'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (text, record, index) => (
        <span>
          <a onClick={() => { this.showPreview(text, record, index); }}>预览</a>
          <Divider type="vertical" />
          <a onClick={() => { this.showEdit(text, record, index); }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => { this.deletUser(text, record, index); }}>删除</a>

        </span>
      )
    }];
  }

  componentDidMount() {
    this.fetchSites();
    this.fetch();
  }

  fetchSites() {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {

      },
      successFn(data) {
        that.setState({
          siteList: data.data
        });
      }
    };
    store.handleNormal(params);
  }

  fetch = (params = {}) => {
    const { searchFilter } = this.state;
    const queryParam = {
      loadingFlag: false,
      url: 'query',
      method: 'post',
      data: {
        numPerPage: 100,
        page: store.dataObj.pagination.current,
        // filter: searchFilter,
        ...searchFilter,
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

  addPicture = () => {
    // console.log(this.instance.getValue());

    const that = this;
    const { siteList } = this.state;
    modal.showModel({
      type: 'dialog',
      title: '上传',
      width: '750px',
      Dialog: modalConfig,
      ok: (value) => {
        console.log(value);
        const params = {
          loadingFlag: false,
          url: '/upload',
          method: 'POST',
          data: value,
          successFn() {
            that.fetch();
          }
        };
        store.doUploadFiles(params);
      },
      param: {
        siteList
      }
    });
  };

  showEdit = (text, record) => {
    const that = this;
    modal.showModel({
      type: 'dialog',
      title: '编辑',
      width: '750px',
      Dialog: modalConfigEdit,
      ok: (value) => {
        const params = {
          loadingFlag: false,
          url: '/mod',
          method: 'POST',
          data: value.upload,
          successFn() {
            that.fetch();
            // that.fetch({ filter: that.searchList.filter });
          }
        };
        store.doUploadFiles(params);
      },
      param: {
        ...record
      }
    });
  };

  deletUser = (text, record) => {
    const that = this;
    const param = {
      url: '/del',
      method: 'POST',
      data: {
        multispectralIds: record.multispectralId
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
      const tempArry = Array.from(selectedRows, (x) => x.multispectralId);
      const param = {
        url: '/del',
        method: 'POST',
        data: {
          multispectralIds: tempArry
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

  showPreview = (text, record) => {
    const tempUrl = `${window.apiUrl}/..${record.imageUrl}`;
    modal.showModel({
      type: 'dialog',
      title: record.name || '',
      width: '650px',
      Dialog: previewPic,
      ok: (value) => {

      },
      param: {
        previewImage: tempUrl
      }
    });
  }
  render() {
    const { selectedRowKeys, siteList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const datasorce = store.dataObj.list.slice();
    const tempDataList = Array.from(datasorce, (item) => ({
      ...item
    }));
    return (
      <Layout name="sgw">
        <div className="sgw">
          <div className="container-out">
            <div className="nav-right">
              <TabHead addPicture={this.addPicture} deletMany={this.deletMany} searchFn={this.searchFn} siteList={siteList} />
            </div>
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

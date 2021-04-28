import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Layout from 'components/layout/layout';
import modal from 'components/modal/modal';
import tabstore from 'store/tablestore';
import {
  Table, Modal, Tabs, Menu, Icon, Button
} from 'antd';
import { toJS } from 'mobx';
import modalConfig from './modalConfig';
import ModalConfigNew from './modalConfigNew';
import TabHead from './tabHead';
import './beam.less';
import BeamTemplate from './beamTemplate';
import activeBitmapConfig from './activeBitmapConfig';
import acctmapConfigBandCheck from './acctmapConfigBandCheck';
import acctmapConfigBand from './acctmapConfigBand';

const store = new tabstore();
const { TabPane } = Tabs;
@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFilter: null,
      selectedRowKeys: [],
      selectedRows: [],
      keyFlag: '1',
      sateList: [],
      templeteList: [],
      templeteDetail: null,
      satelliteid: '',
      beamId: '',
      addModFlag: 0,
      recordData: null
    };
    this.addModelFlag = null;
    this.loadingDialog = null;
    this.templeteId = null;
    this.columns = [
 
      // {
      //   title: '',
      //   dataIndex: 'activechannelbitmapTwo',
      //   key: 'activechannelbitmapTwo',
      //   render: (text, record, index) => {
      //     const textArry = [...text];
      //     const deffNum = 16 - textArry.length;
      //     const zeroArry = new Array(deffNum).fill(0);
      //     const newText = [...zeroArry, ...textArry];
      //     return (
      //       <div>
      //         {
      //
      //           newText.map((item, subindex) => {
      //             const tempDom = item === '1' ? (<span key={subindex} style={{ background: '#1C9CBD' }} className="activeSp" />) : (<span key={subindex} style={{ background: '#BBBBBB' }} className="activeSp" />);
      //             return tempDom;
      //           })
      //
      //         }
      //       </div>
      //     );
      //   }
      // },
     ];
  }

  componentDidMount() {
    this.fetchSateList();
    this.fetchTempList();
    const searchId = window.location.pathname.split(':')[1];
    if (searchId !== '-1') {
      this.fetch({ satelliteid: searchId });
      this.setState({ satelliteid: searchId });
    }
  }

  fetchSateList=(param = {}) => {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...param
      },
      successFn(data) {
        that.setState({
          sateList: data.data,
          satelliteid: data.data.length > 0 ? data.data[0].id : ''
        }, () => {
          const searchId = window.location.pathname.split(':')[1];
          if (searchId === '-1') {
            const { satelliteid } = that.state;
            that.fetch({ satelliteid });
          }
        });
      }
    };
    store.handleNormal(params);
  }

  fetchTempList=(param = {}) => {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...param
      },
      successFn(data) {
        that.setState({
          templeteList: data.data
        });
      }
    };
    store.handleNormal(params);
  }

  fetchTempSingle=(param = {}) => {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...param
      },
      successFn(data) {
        const tempCont = JSON.parse(data.data.content);
        const templeteList = {
          ...tempCont, name: data.data.name, remark: data.data.remark, modelid: data.data.id
        };
        that.setState({
          templeteDetail: templeteList
        });
      }
    };
    store.handleNormal(params);
  }

  fetch = (params = {}) => {
    const { searchFilter, satelliteid, beamId } = this.state;
    const queryParam = {
      loadingFlag: false,
      url: '',
      method: 'post',
      data: {
        numPerPage: store.dataObj.pagination.pageSize,
        page: store.dataObj.pagination.current,
        // filter: searchFilter,
        beamId: beamId === '' ? undefined : beamId,
        ...searchFilter,
        satelliteid,
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

  addBeam = () => {
    // const that = this;
    // const { satelliteid } = this.state;
    // modal.showModel({
    //   type: 'dialog',
    //   title: '新增',
    //   width: '1100px',
    //   Dialog: modalConfig,
    //   ok: (value, tempitem) => {
    //     const params = {
    //       loadingFlag: false,
    //       url: '',
    //       method: 'POST',
    //       data: {
    //         ...value
    //       },
    //       successFn() {
    //         that.fetch();
    //         modal.closeModel(tempitem.id);
    //       }
    //     };
    //     store.handleNormal(params);
    //   },
    //   param: {
    //     satelliteid
    //   }
    // });
    window.localStorage.setItem('selectedBand', []);
    this.setState({
      addModFlag: 1,
      recordData: null
    });
  };

  showAcctmapConfigDetail = (text, record, index) => {
    // const that = this;
    // modal.showModel({
    //   type: 'dialog',
    //   title: '',
    //   width: '1000px',
    //   Dialog: acctmapConfigBandCheck,
    //   ok: (value, tempitem) => {
    //     const params = {
    //       loadingFlag: false,
    //       url: '',
    //       method: 'POST',
    //       data: {
    //         ...value
    //       },
    //       successFn() {
    //         that.fetch();
    //         modal.closeModel(tempitem.id);
    //       }
    //     };
    //     store.handleNormal(params);
    //   },
    //   param: {
    //     ...record
    //   }
    // });


    const bandinfolist = record === null ? [] : toJS(record.bandinfolist);
    const tempbandinfolist = bandinfolist.map((item) => {
      const accesscarrierbitmap = item.activechannelbitmap ? parseInt(item.activechannelbitmap, 16) : '';
      const tempTwo = accesscarrierbitmap.toString(2);
      return {
        bandid: item.bandid,
        desiredchannelbitmap: tempTwo
      };
    });
    modal.showModel({
      type: 'dialog',
      title: '',
      width: '1050px',
      Dialog: acctmapConfigBandCheck,
      ok: (value) => {
      },
      param: {
        bandinfolist: tempbandinfolist
      }
    });
  };

  showAcctmapConfig = (text, record, index) => {
    const that = this;
    modal.showModel({
      type: 'dialog',
      title: '',
      width: '750px',
      Dialog: activeBitmapConfig,
      ok: (value, tempitem) => {
        const params = {
          loadingFlag: false,
          url: '',
          method: 'POST',
          data: {
            ...value
          },
          successFn() {
            that.fetch();
            modal.closeModel(tempitem.id);
          }
        };
        store.handleNormal(params);
      },
      param: {
        ...record
      }
    });
  };

    const that = this;
    const param = {
      url: '',
      method: 'POST',
      data: {
        ids: [
          {
            beamid: record.beamid,
            satelliteid: record.satelliteid
          }
        ]

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
    const that = this;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      Modal.warning({
        title: '请选择删除项'
      });
    } else {
      const tempArry = Array.from(selectedRows, (x) => ({ beamid: x.beamid, satelliteid: x.satelliteid }));
      const param = {
        url: '',
        method: 'POST',
        data: {
          ids: tempArry
        },
        successFn() {
          that.fetch();
          that.setState({ selectedRowKeys: [], selectedRows: [] });
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

  gobackFn=() => {
    this.props.history.goBack();
  }

  callback=(key) => {
    this.setState({
      keyFlag: key
    });
    if (key === '2') {
      this.fetchTempList();
    }
  }

  handleClick = (e) => {
    this.fetch({ satelliteid: e.key });
    this.setState({ satelliteid: e.key });
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }

  handleClickTemp=(e) => {
    this.templeteId = e.key;
    this.fetchTempSingle({ id: e.key });
  }

  deletTemp=(id) => {
    const that = this;
    const param = {
      url: '',
      method: 'POST',
      data: {
        id

      },
      successFn() {
        that.fetchTempList();
        that.setState({ templeteDetail: null });
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

  addModel=() => {
    this.addModelFlag = 1;
    this.setState({ templeteDetail: null });
  }

  freshTempList=() => {
    this.fetchTempList();
    const { templeteDetail } = this.state;
    if (templeteDetail !== null) {
      this.fetchTempSingle({ id: this.templeteId });
    }
  }

  cancelClickHandler=() => {
    this.setState({
      addModFlag: 0
    });
  }

  handleAdd=(value) => {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...value
      },
      successFn() {
        that.setState({
          addModFlag: 0
        });
        const { satelliteid } = that.state;
        that.fetch();
      }
    };
    store.handleNormal(params);
  }

  handleEdit=(value) => {
    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...value
      },
      successFn() {
        that.setState({
          addModFlag: 0
        });
        const { satelliteid } = that.state;
        that.fetch();
      }
    };
    store.handleNormal(params);
  }

  render() {
    const {
      selectedRowKeys, keyFlag, sateList, templeteList, templeteDetail, addModFlag, satelliteid, recordData
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const datasorce = store.dataObj.list.slice();
    const tempDataList = Array.from(datasorce, (item) => ({
      ...item,
      key: item.beamid,
      accesscarrierbitmapTwo: parseInt(item.accesscarrierbitmap, 16).toString(2),
      activechannelbitmapTwo: parseInt(item.activechannelbitmap, 16).toString(2),
      reportchannelbitmapTwo: parseInt(item.reportchannelbitmap, 16).toString(2)
    }));
    const searchId = window.location.pathname.split(':')[1];
    const defaultselected = searchId === '-1' && satelliteid !== '' ? `${satelliteid}` : `${searchId}`;
    return (
      <Layout name="beam">
        <div className="beamContainer">
          {
            addModFlag === 0 ? (
              <div className="beam">
                <div className="container-left" style={{ position: 'relative' }}>
                  {
                  keyFlag === '2' ? (
                    <Button type="primary" className="addmodelBtn" onClick={this.addModel}> <Icon
                      type="plus"
                    />新增
                    </Button>
                  ) : ''

                }

                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="" key="1">

                      <Menu
                        // defaultSelectedKeys={[searchId !== '-1' ? `${searchId}` : `${defaultselected}`]}
                        defaultSelectedKeys={[defaultselected]}
                        key={defaultselected}
                        mode="inline"
                        theme="light"
                        onClick={this.handleClick}
                      >
                        {
                        sateList.map((item) => (
                          <Menu.Item key={item.id}>
                            <span>{item.name}</span>
                          </Menu.Item>
                        ))
                      }
                      </Menu>
                    </TabPane>
                    <TabPane tab="" key="2">
                      <Menu
                      // defaultSelectedKeys={[templeteList.length ? templeteList[0].id : '']}
                      // defaultOpenKeys={[templeteList[0].id]}
                        mode="inline"
                        theme="light"
                        onClick={this.handleClickTemp}
                      >
                        {
                        templeteList.map((item) => (
                          <Menu.Item key={item.id} style={{ position: 'relative' }}>
                            <span>{item.name}</span>
                            <Icon
                              type="close"
                              onClick={this.deletTemp.bind(this, item.id)}
                              className="closeTemp"
                              title=""
                            />
                          </Menu.Item>
                        ))
                      }
                      </Menu>

                    </TabPane>
                  </Tabs>
                </div>
                <div className="container-right">
                  {
                  keyFlag === '1' ? (
                    <div>
                      <div className="nav-right">
                        <TabHead
                          addBeam={this.addBeam}
                          deletMany={this.deletMany}
                          searchFn={this.searchFn}
                          refreshAll={this.refreshFetch}
                          goback={this.gobackFn}
                          param={[]}
                        />
                      </div>
                      <Table
                        className="deviceConfigTab"
                        rowSelection={rowSelection}
                        columns={this.columns}
                        bordered
                        dataSource={tempDataList}
                        pagination={store.dataObj.pagination}
                        // scroll={{ x: 2400, y: 'calc(80vh - 140px)' }}
                        onChange={this.handleTableChange}
                      />
                    </div>
                  ) : (
                    <BeamTemplate
                      param={templeteDetail}
                      addModelFlag={this.addModelFlag}
                      freshTempList={this.freshTempList}
                    />
                  )
                }

                </div>
              </div>
            ) : (<ModalConfigNew satelliteid={satelliteid} recordData={recordData} handleAdd={this.handleAdd} handleEdit={this.handleEdit} cancelClickHandler={this.cancelClickHandler} />)


          }
        </div>
      </Layout>
    );
  }
}
export default PageComponent;

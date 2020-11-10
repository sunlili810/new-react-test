import React, { Component } from 'react';
import { observer } from 'mobx-react';
import LayoutCom from 'components/layout/layout';
import { Table } from 'antd';
import tabstore from 'store/tablestore';
import TabHead from './filterHead';

const store = new tabstore();

@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.eventListenser = this.eventListenser.bind(this);
    this.state = {

    };
  }

  componentDidMount() {
    // this.doQuery();
  }

  componentWillUnmount() {

  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  eventListenser(type, data) {
    switch (type) {
      case 'filter':
        this.filter(data);
        break;
      case 'confirm':
        this.bundleConfirm(data);
        break;
      case 'export':
        this.exportFn(data);
        break;
      case 'reload':
        this.reload();
        break;
      default: break;
    }
  }

  reload() {
    // store.data.devModellist = [];
    store.data.pagination.total = 0;
    store.data.pagination.current = 1;
    this.setState({ dataSource: [], columns: [] });
  }

  filter(data) {
    this.setState({ conditionFilter: data }, () => {
      this.doQuery();
    });
  }


  render() {
    const { param } = this.props;
    const {
      dataSource, columns, doQuery, pagination, filterHead
    } = param;
    dataSource.map((item, index) => Object.assign(item, { key: index + 1 }));
    return (
      <div className="historyalert">
        <div className="history-header">
          <TabHead filterHead={filterHead} />
          {/* onTrigger={this.eventListenser} */}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={doQuery}
          bordered
        />
      </div>
    );
  }
}
export default PageComponent;

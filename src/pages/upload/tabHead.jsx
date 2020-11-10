import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Select, DatePicker
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import tabstore from 'store/tablestore';

const FormItem = Form.Item;
const { Option } = Select;
const store = new tabstore();
class pageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteList: []
    };
    this.searchListFn = this.searchListFn.bind(this);
  }

  componentDidMount() {

  }


  searchListFn() {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const data = {
        ...values
      };
      const { searchFn } = this.props;
      searchFn(data);
    });
  }

  onFinish = (values) => {
    const { searchFn } = this.props;
    const data = {
      ...values
    };
    searchFn(data);
  };

  render() {
    const {
      addPicture, deletMany, siteList
    } = this.props;
    return (
      <Form
        layout="horizontal"
        onFinish={this.onFinish}
        style={{
          display: 'inline-block', textAlign: 'left', verticalAlign: 'middle', width: '100%'
        }}
      >
        <div style={{
          display: 'inline-block', textAlign: 'left', minWidth: '311px', marginLeft: '10px'
        }}
        >
          <FormItem
            label="地点："
            name="exemplaryId"
            rules={[{ required: false, message: '请选择地点' }]}
            {...{
              labelCol: {
                span: 4
              },
              wrapperCol: {
                span: 20
              }
            }}
          >
            <Select allowClear placeholder="请选择地点" style={{ display: 'inline-block' }}>
              { siteList !== null ? siteList.map((item, index) => (<Option key={index} value={item.deveui}>{item.devname}</Option>)) : ''}
            </Select>
          </FormItem>
        </div>
        <div style={{
          display: 'inline-block', textAlign: 'left', minWidth: '311px', marginLeft: '10px'
        }}
        >
          <FormItem
            label="时间："
            name="shootTime"
            rules={[{ required: false, message: '请选择时间' }]}
            {...{
              labelCol: {
                span: 6
              },
              wrapperCol: {
                span: 18
              }
            }}
          >
            <DatePicker
              // showTime
              locale={locale}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </FormItem>
        </div>
        <div style={{ textAlign: 'left', display: 'inline-block' }}>
          <div style={{
            display: 'inline-block', textAlign: 'left', minWidth: '311px', marginLeft: '10px'
          }}
          >
            <FormItem
              wrapperCol={{ span: 24 }}
              className="footer"
            >
              <Button className="btn-add" type="primary" htmlType="submit" style={{ marginRight: '5px' }}>查询</Button>
              <Button className="btn-add" type="primary" onClick={addPicture} icon={<UploadOutlined />}>选择图片</Button>
            </FormItem>
          </div>
        </div>
      </Form>
    );
  }
}

pageComponent.propTypes = {
  // form: PropTypes.object.isRequired,
  addPicture: PropTypes.func.isRequired,
  deletMany: PropTypes.func.isRequired,
  searchFn: PropTypes.func.isRequired
  // param: PropTypes.array.isRequired
};
// export default Form.create()(pageComponent);
export default pageComponent;

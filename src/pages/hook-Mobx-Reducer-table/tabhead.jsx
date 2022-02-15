import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Input, Select, Divider, TreeSelect
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

function tabHead(props) {
  const onFinish = (values) => {
    const data = {
      ...values
    };
    const { searchFn } = props;
    searchFn(data);
  };

  const exportListFn = (values) => {
    const data = {
      ...values
    };
    const { exportFn } = props;
    exportFn(data);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    // return e.fileList;
    return e && [e.file];
  };

  const { addLine, deleteLines } = props;

  return (
    <div className="peopleTabhead">
      <Form layout="horizontal" onFinish={onFinish} style={{ display: 'inline-block', textAlign: 'left', verticalAlign: 'middle' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'inline-block', textAlign: 'left', width: '240px' }}>
            <FormItem
              label="类型："
                // hasFeedback
              {...{ labelCol: { span: 5 }, wrapperCol: { span: 18 } }}
              style={{ paddingLeft: '1%' }}
              name="pcs_type"
              rules={[{ required: false, message: '请选择类型!' }]}
            >
              <Select>
                <Option value="0">孤寡老人</Option>
               
              </Select>
            </FormItem>
          </div>
          <div style={{
            display: 'inline-block', textAlign: 'left', minWidth: '411px', marginLeft: '10px'
          }}
          >
            <FormItem
              wrapperCol={{ span: 24 }}
              className="footer"
              style={{ paddingLeft: '3%' }}
            >
              <Button type="primary" htmlType="submit">查询</Button>
              {/* <span className="ant-divider" /> */}
              {/* <Button className="btn-add" type="primary" onClick={this.exportListFn}>导出</Button> */}
              <Divider type="vertical" />
              <Button className="btn-add" type="primary" onClick={addLine}>新增</Button>
              <Divider type="vertical" />
              <Button className="btn-add" type="primary" onClick={deleteLines}>批量删除</Button>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
  );
}
export default tabHead;

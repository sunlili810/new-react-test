import React, { Component } from 'react';
import {
  Form, Input, Button, Select, Row, Col
} from 'antd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import modalSecond from 'components/modal/modalSecond';
import dynamicTablestore from 'store/tablestore';
import IPut from './ipInput';

const dynamtore = new dynamicTablestore();
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
};
@observer
class modalComponent extends Component {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  handleOk() {
    const { param } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const data = {
        ...values,
        ipaddr: typeof values.ipaddr === 'object' ? values.ipaddr.join('.') : values.ipaddr
      };
      this.props.onTrigger('okBtn', data);
    });
  }

  cancelClickHandler() {
    this.props.onTrigger('cancelBtn');
  }

  changeFn(values) {
    // console.log(values);
  }

  onFinish = (values) => {
    const data = {
      ...values,
      ipaddr: typeof values.ipaddr === 'object' ? values.ipaddr.join('.') : values.ipaddr
    };
    this.props.onTrigger('okBtn', data);
  };

  render() {
    const { param } = this.props;
    // {id: 0
    // ipaddr: "12.123.12.12"
    // key: 1
    // name: "gagag"
    // port: 51000
    // status: "offline"
    // statusDesc: "离线"}
    const fieldData = [
      {
        name: 'id',
        value: 'Ant Design'
      }
    ];
    const { entries } = Object;
    const tempFieldData = [];
    for (const [key, value] of entries(param)) {
      tempFieldData.push({
        name: key,
        value
      });
    }

    return (
      <div className="swConfig" style={{ position: 'relative' }}>
        <Form layout="horizontal" initialValues={{ port: '51000' }} fields={tempFieldData} onFinish={this.onFinish}>

          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="信关站标识：" name="id" rules={[{ required: true, message: '请填写信关站ID' }]} hasFeedback {...formItemLayout}>

                <Input disabled={param.id !== 0 ? !!param.id : true} placeholder="请输入0~31" />

              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem name="ipaddr" label="IP地址：" rules={[{ required: true, message: '请填写IP地址' }]} hasFeedback {...formItemLayout}>
                <IPut initialValue={this.props.param.ipaddr} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="信关站名称：" name="name" rules={[{ required: false, message: '请填写信关站名称' }]} hasFeedback {...formItemLayout}>
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="端口号：" name="port" rules={[{ required: true, message: '请填写端口号' }]} hasFeedback {...formItemLayout}>
                <Input placeholder="请输入1025~65535" />
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <FormItem
                wrapperCol={{ span: 24 }}
                className="footer"
                style={{ textAlign: 'center' }}
              >
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.cancelClickHandler}>
                  取消
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

modalComponent.propTypes = {
  param: PropTypes.object.isRequired,
  onTrigger: PropTypes.func.isRequired
};

export default modalComponent;

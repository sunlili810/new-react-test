import React, { Component } from 'react';
import {
  Form, Upload, Button, Select
} from 'antd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import dynamicTablestore from 'store/tablestore';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const dynamtore = new dynamicTablestore();
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 15
  }
};
@observer
class modalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
  }

  cancelClickHandler() {
    this.props.onTrigger('cancelBtn');
  }

  render() {
    const { param } = this.props;
    const { previewImage } = param;

    return (
      <div className="swConfig" style={{ position: 'relative' }}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </div>
    );
  }
}

modalComponent.propTypes = {
  param: PropTypes.object.isRequired,
  onTrigger: PropTypes.func.isRequired
};

export default modalComponent;

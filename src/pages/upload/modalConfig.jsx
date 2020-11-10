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
      fileList: [],
      uploading: false
    };
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  cancelClickHandler() {
    this.props.onTrigger('cancelBtn');
  }

  onFinish = (values) => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('imgs[]', file);
    });
    formData.append('exemplaryId', values.exemplaryId);
    formData.append('projectid', localStorage.getItem('PROJECTID'));
    this.setState({
      fileList: []
    });
    this.props.onTrigger('okBtn', formData);
  };

  render() {
    const { param } = this.props;
    const { siteList } = param;

    // const fieldData = [
    //  {
    //    name: 'id',
    //    value: 'Ant Design'
    //  }
    // ];
    // const { entries } = Object;
    // const tempFieldData = [];
    // for (const [key, value] of entries(param)) {
    //  tempFieldData.push({
    //    name: key,
    //    value
    //  });
    // }

    const { fileList } = this.state;
    const props = {
      multiple: true,
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <div className="swConfig" style={{ position: 'relative' }}>
        <Form
          layout="horizontal"
          initialValues={{ port: '51000' }}
          /* fields={tempFieldData} */
          onFinish={this.onFinish}
        >
          <FormItem label="地点：" name="exemplaryId" rules={[{ required: true, message: '请选择地点' }]} hasFeedback {...formItemLayout}>

            <Select placeholder="请选择地点" style={{ display: 'inline-block' }}>
              { siteList.map((item, index) => (<Option key={index} value={item.deveui}>{item.devname}</Option>))}
            </Select>

          </FormItem>
          <FormItem label="图：" name="imgs" rules={[{ required: true, message: '请上传图' }]} {...formItemLayout}>
            <Upload
              {...props}
              listType="picture-card"
            >
              {/* <Button icon={<UploadOutlined />}>选择图片</Button> */}
              {uploadButton}
            </Upload>
          </FormItem>

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
        </Form>
      </div>
    );
  }
}

modalComponent.propTypes = {
  // form: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  onTrigger: PropTypes.func.isRequired
};

export default modalComponent;

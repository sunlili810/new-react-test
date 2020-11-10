import React, { Component } from 'react';
import {
  Form, Upload, Button, Select, DatePicker, Input
} from 'antd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import modal from 'components/modal/modal';
import dynamicTablestore from 'store/tablestore';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import previewPic from './previewPicModal';

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
      fileList: []
    };
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount(){
    const {param}=this.props;
    this.setState({
      fileList:[{
        uid: param.multispectralId,
        name: param.name,
        status: 'done',
        url: window.apiUrl+'/..'+param.imageUrl
      }]
    });
  }
  cancelClickHandler() {
    this.props.onTrigger('cancelBtn');
  }

  onFinish = (values) => {
    this.setState({
      fileList: []
    });
    const { param } = this.props;
    // const tempUpload = values.upload.file?values.upload.file:values.upload[0];
    const formData = new FormData();
    // tempUpload.forEach((file) => {
    //  formData.append('files[]', file.originFileObj);
    // });
    // formData.append('imgs[]', tempUpload);

    if (values.upload.file) {
      formData.append('imgs[]', values.upload.file);
    }

    formData.append('exemplaryId', param.exemplaryId);
    formData.append('multispectralId', param.multispectralId);
    formData.append('projectid', localStorage.getItem('PROJECTID'));
    formData.append('name', values.name);
    formData.append('shootTime', values.shootTime.format('YYYY-MM-DD'));

    const data = {
      upload: formData
    };
    this.props.onTrigger('okBtn', data);
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    // this.setState({
    //  previewImage: file.url || file.preview,
    //  previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    // });

    modal.showModel({
      type: 'dialog',
      title: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      width: '650px',
      Dialog: previewPic,
      ok: (value) => {

      },
      param: {
        previewImage: file.url || file.preview
      }
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  render() {
    const { form, param } = this.props;
     const { fileList } = this.state;
    const props = {
      multiple: false,
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
          fileList: [file]
          //fileList: [...state.fileList, file]
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
      <div className="swConfigEdit" style={{ position: 'relative' }}>
        <Form
          layout="horizontal"
          initialValues={{
            name: param.name,
            shootTime: param.shootTime === null ? moment() : moment(param.shootTime),
            upload: fileList
          }}
          /* fields={tempFieldData} */
          onFinish={this.onFinish}
        >
          <FormItem label="名称：" name="name" rules={[{ required: true, message: '请填写名称' }]} hasFeedback {...formItemLayout}>

            <Input autoComplete="off" />

          </FormItem>
          <FormItem label="时间：" name="shootTime" rules={[{ required: true, message: '请选择时间' }]} hasFeedback {...formItemLayout}>

            <DatePicker
             locale={locale}
              format="YYYY-MM-DD"
            />

          </FormItem>
          <FormItem label="图片：" name="upload" rules={[{ required: false, message: '请上传图' }]} {...formItemLayout}>
            <Upload
              {...props}
              listType="picture-card"
              onPreview={this.handlePreview}
            >
               {/*<img src={window.apiUrl+'/..'+param.imageUrl} style={{width:'100px',height:'100px'}} />*/}
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
  // param: PropTypes.object.isRequired,
  onTrigger: PropTypes.func.isRequired
};

export default modalComponent;

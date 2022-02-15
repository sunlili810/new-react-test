import React, { Component, useState } from 'react';
import { observer } from 'mobx-react';
import {
  Form, Input, Button, Select, Upload, Icon, DatePicker, TreeSelect, Row, Col
} from 'antd';
import modal from 'components/modal/modal';
import moment from 'moment';
import {
  PlusOutlined
} from '@ant-design/icons';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

function tableConfig(props) {
  const [fileList, setFileList] = useState([]);
  const cancelClickHandler = () => {
    props.onTrigger('cancelBtn');
  };

  const handleOk = (values) => {
    const formData = new FormData();
    const tempUpload = values.upload.slice();
    if (tempUpload !== '') {
      tempUpload?.map((file) => {
        if (file.originFileObj !== undefined) {
          formData.append('file', file.originFileObj);
        }
      });
    }

    formData.append('flag', values.flag);
    formData.append('opflag', 2);
    // formData.append('personid', values.personid);
    // formData.append('birthday', values.birthday.format('YYYY-MM-DD'));
    const data = {
      table: formData
      // ...values
    };
    props.onTrigger('okBtn', data);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    // return e && [e.file];
    return e && e.fileList;
  };

  const timechange = (date, dateString) => {
    console.log(date, dateString);
  };

  const { param } = props;
  const { placelist, organlist } = param;
  const propsphoto = {
    multiple: false,
    action: ``,
    accept: 'image/*',
    listType: 'picture-card',
    onRemove: (file) => {
    },
    beforeUpload: (file) =>
    // this.setState(state => ({
    // 	fileList: [file]
    // }));
      false,
    onChange: ({ file, fileList }) => {
      setFileList(fileList);
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      {/* <div className="ant-upload-text">Upload</div> */}
    </div>
    // <Button style={{ width: '210px' }}>
    // 	{/*<Icon type="upload" />上传照片*/}
    //
    // </Button>
  );
  const personid = param.personid ? param.personid : '';
  const birthday = param.birthday ? moment(param.birthday) : '';
  const upload = param.upload ? param.upload : '';

  return (
    <div className="peopleTableConfig">
      <Form
        onFinish={handleOk}
                // layout="horizontal"
                // labelCol={{ span: 5 }}
                // wrapperCol={{ span: 19 }}
        layout="vertical"
        initialValues={{

          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          rate: 3.5,
          personid,
          upload
        }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <FormItem
              label="类型"
              hasFeedback

                            // style={{ display: 'inline-block', width: '48%' }}
              name="pcs_type"
              rules={[{ required: false, message: '类型!' }]}
            >
              <Select>
                <Option value="0">孤寡老人</Option>
          
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              label="设置"
              hasFeedback

                            // style={{ display: 'inline-block', width: '48%' }}
              name="pcs_set"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Select>
                <Option value="0">启动</Option>
                <Option value="1">关闭</Option>
              </Select>
            </FormItem>
          </Col>

        </Row>

        <FormItem
          wrapperCol={{ span: 24 }}
          className="footer"
          style={{ textAlign: 'center' }}
        >
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={cancelClickHandler}>
            取消
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

// modalComponent.propTypes = {
//   param: PropTypes.object.isRequired,
//   onTrigger: PropTypes.func.isRequired
// };
export default tableConfig;

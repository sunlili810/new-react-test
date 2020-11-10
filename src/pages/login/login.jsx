import React, { Component } from 'react';
import {
  Form, Input, Button
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import LoginStore from 'store/loginstore';
import logo from 'images/login-logo.png';
import claa from 'images/claa.png';
import './login.less';
import CryptoJS from 'crypto-js/crypto-js';

const FormItem = Form.Item;
const loginUrl = 'emsapi/v1/auth/login';
const store = new LoginStore();

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleLogo: logo,
      loginTxt: ''
    };
    this.loginSuccess = this.loginSuccess.bind(this);
    this.formRef = React.createRef();
  }
  encryption = (userValue, passValue) => {
    const flag = Math.floor((Math.random() * 65536 * 65535) + 1);
    const key1 = flag.toString(16);
    const key2 = 'clattttttttttttta2019';
    const username = userValue;
    const key = CryptoJS.enc.Latin1.parse(key1 + key2);
    const iv = CryptoJS.enc.Latin1.parse(key1 + key2);
    // 加密
    let encrypted = CryptoJS.AES.encrypt(username, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
    // console.log(`encrypted: ${encrypted}`);
    // 解密
    // const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv, padding: CryptoJS.pad.ZeroPadding });
    // // console.log(`decrypted: ${decrypted.toString(CryptoJS.enc.Utf8)}`);


    const parameters = {
      username: encrypted.toString()
    };

    const password = passValue;
    encrypted = CryptoJS.AES.encrypt(password, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
    parameters.password = encrypted.toString();

    const appnonceKey = CryptoJS.enc.Latin1.parse('claa2019claa2019');
    const appnonceIv = CryptoJS.enc.Latin1.parse('claa2019claa2019');
    const encryptedAppnonce = CryptoJS.AES.encrypt(key1, appnonceKey, { iv: appnonceIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });

    parameters.appnonce = encryptedAppnonce.toString();
    // const str = JSON.stringify(parameters);
    return parameters;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        localStorage.setItem('username', values.userName);
        const param = {
          loadingFlag: false,
          url: loginUrl,
          method: 'POST',
          data: {
            username: values.userName,
            password: values.password,
            project: window.apiUrl.split('/')[3]
          },
          querySuccess: this.loginSuccess
        };
        store.login(param);
      }
    });
  };

  onFinish = (values) => {
    const tempParameters = this.encryption(values.userName, values.password);
    const param = {
      loadingFlag: false,
      url: loginUrl,
      method: 'POST',
      data: tempParameters,
      querySuccess: this.loginSuccess
    };
    store.login(param);
  };

  onFinishFailed = (errorInfo) => {
    // this.formRef.current.scrollToField(errorFields[0].name);

  };

  loginSuccess(data) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('menuObj', JSON.stringify(data.data));
    // const List = data.data.list;
    // List.sort((i1, i2) => i1.index - i2.index);
    this.props.history.push('/charing');
    store.data.menuObj = {
      layoutTitle: data.data.layoutTitle,
      menulist: List
    };
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { titleLogo, loginTxt } = this.state;
    return (
      <div className="login">
        <div className="container-out">
          <div className="container">
            <div className="content">
              <div className="logo">
                <img src={titleLogo} alt="" />
              </div>
              <Form ref={this.formRef} onFinish={this.onFinish}  className="login-form">
                <FormItem
                  name="userName"
                  rules={[{ required: true, message: '请输入用户名!' }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"

                  />
                </FormItem>
                <FormItem
                  name="password"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input
                    size="large"
                    prefix={(<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />)}
                    type="password"
                    placeholder="密码"

                  />
                </FormItem>
                <FormItem>

                  <Button type="primary" size="large" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                  {/* <a href="">注册</a> */}
                </FormItem>
              </Form>
            </div>
            {
              window.apiUrl.split('/')[3] === 'zt_zayw' ? (
                <div style={{ textAlign: 'center', margin: '50px 0 0' }}>
                  <img src={claa} alt="" style={{ width: '60%' }} />
                </div>
              ) : ''
            }
            <div className="text">
              <span className="line-div" />
              <span className="text-comp">{loginTxt}</span>
              <span className="line-div" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PageComponent.propTypes = {
  // form: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
// const WrappedNormalLoginForm = Form.create()(PageComponent);
// export default WrappedNormalLoginForm;
export default PageComponent;

import React, { Component } from 'react';
import {
  Layout, Menu, Col, Button, Dropdown
} from 'antd';
import { BarsOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import menus from 'localData/menulist.json';
import change from 'images/change.jpg';
import user from 'images/yonghu.jpg';
import exit from 'images/exit.jpg';
import './layout.less';
import $ from 'jquery';
import DynamicIconFn from 'pages/index/dynamicIcon';

const {
        Content, Sider, Header
      } = Layout;
const { SubMenu } = Menu;

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menusList: menus
    };
  }

  componentWillMount() {
    // const tempObj = localStorage.getItem('menuObj');

    // const tempMenu = tempObj === 'undefined' ? {} : JSON.parse(localStorage.getItem('menuObj'));
    const menusList = menus;

    this.setState({
      menusList
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    // const project = window.apiUrl.split('/')[3];
    const { menusList, collapsed } = this.state;
    const { children, name } = this.props;
    const layoutBgc = name === 'dashboard' ? { margin: '14px', backgroundColor: '#e7ebee' } : {
      margin: '14px', padding: '20px'
    };
    const tempPath = window.location.pathname.split('/');
    const subRouter = `${tempPath[1]}/${tempPath[2]}`;
    let defaultKey = '';
    if (subRouter && subRouter !== '/undefined' && subRouter !== 'doorguard/undefined') {
      defaultKey = subRouter.substr(0, 6) === 'device'
        ? window.location.search.substr(1, window.location.search.length - 1) : subRouter;
    } else if (subRouter === '/undefined') {
      defaultKey = 'doorguard/organization';
    } else {
      defaultKey = 'doorguard/organization';
    }
    const defaultOpenKeys = '';
    const menuList = menusList.list;
    const menu = (
      <Menu className="profile-menu" onClick={this.handleProfileClick}>
        <Menu.Item>
          <span type="ant-btn-primary" onClick={this.changepassword} style={{ color: 'black' }}><img src={change} alt="" style={{ margin: '0 10px 0 5px' }} />修改密码</span>
        </Menu.Item>
        <Menu.Item key="exit">
          <img src={exit} style={{ margin: '0 10px 0 5px' }} /><div style={{ display: 'inline', lineHeight: '' }}><Link to="/login" style={{ color: 'black', textDecoration: 'none' }}>退出登录</Link></div>
        </Menu.Item>
      </Menu>
    );
    return (

      <Layout style={{ minHeight: '100vh', overflowY: 'auto' }} className="main-layout">
        <Sider
          className="main-slider"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          // trigger={null}
        >
          {/* <Link to="/dashboard"> */}
          {/* <div className="logo" style={{ background: `url(${layoutLogo}) no-repeat` }} /> */}
          {/* </Link> */}
          <Link to="/position">
            <div className={this.state.collapsed ? 'small-logo' : 'logo'} />
          </Link>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultKey]}
            defaultOpenKeys={[defaultOpenKeys]}
          >
            {menuList.length ? menuList.map((item) => (item.sub ? (
              <SubMenu
                key={item.key}
                title={(
                  <span>
                    <BarsOutlined />
                    <span>{item.name}</span>
                  </span>
                )}
              >
                {item.sub.length ? item.sub.map((subItem) => (
                  <Menu.Item key={subItem.key} className="main-sub">
                    {subItem.name}
                  </Menu.Item>
                )) : ''}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} className="main-menu">
                <Link to={`/${item.key}`}>
                  <DynamicIconFn param={item.icon} />
                  <span className="nav-text">{item.name}</span>
                </Link>
              </Menu.Item>
            )))
              : ''}
          </Menu>

        </Sider>
        <Layout className="site-layout" style={{ width: '90%' }}>
          <Header className="site-layout-background">
            <Col span={22}>
              <LeftOutlined
                className="trigger"
                type={this.state.collapsed ? 'double-right' : 'double-left'}
                onClick={this.toggle}
              />
              CLS200定位系统
            </Col>
            <Col span={2} style={{ lineHeight: '63px' }}>
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button><img src={user} style={{ marginRight: '10px' }} /><div style={{ display: 'inline', lineHeight: '30px', color: 'black' }}>用户中心</div></Button>
              </Dropdown>
            </Col>
          </Header>
          <Content style={layoutBgc}>
            <div className="content-layout" id="right-content" style={{ overflow: 'hidden' }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

PageComponent.propTypes = {
  children: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired
};

export default PageComponent;

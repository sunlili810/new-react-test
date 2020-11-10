import {
  Layout, Menu, Col, Button, Dropdown,Row
} from 'antd';
import {withRouter} from "react-router-dom";
import React, { Component } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  BarsOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//import menus from 'localData/menulist.json';
import menus from 'localData/menulist.jsx';
import change from 'images/change.jpg';
import user from 'images/yonghu.jpg';
import exit from 'images/exit.jpg';
import './layout.less';
//import DynamicIconFn from 'pages/index/dynamicIcon';
import * as Icon from '@ant-design/icons';

const {
  Header, Content, Footer, Sider
} = Layout;
const { SubMenu } = Menu;

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menusList: menus
    };
    this.gologin=this.gologin.bind(this);
  }


  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  gologin(){
    localStorage.setItem('PROJECTID', null);
    const loginRouter =  `${window.routername}`;

    this.props.history.push(loginRouter);
    //this.props.history.goBack(-1)
  }


  render() {
    const { menusList, collapsed } = this.state;
    const { children, name } = this.props;
    const layoutBgc = name === 'dashboard' ? { margin: '14px', backgroundColor: '#e7ebee' } : {
      margin: '14px', padding: '20px'
    };
    const tempPath = window.location.pathname.split('/');
    const subRouter = `/${tempPath[1]}/${tempPath[2]}`;
    let defaultKey = '';
    if (subRouter && subRouter !== '/undefined' && subRouter !== 'doorguard/undefined') {
      defaultKey = subRouter.substr(0, 6) === 'device'
        ? window.location.search.substr(1, window.location.search.length - 1) : subRouter;
    }
    const defaultOpenKeys = '';
    //const menuList = menusList.list;
    const menu = (
      <Menu className="profile-menu" onClick={this.handleProfileClick}>
        <Menu.Item>
          <span type="ant-btn-primary" onClick={this.changepassword} style={{ color: 'black' }}><img src={change} alt="" style={{ margin: '0 10px 0 5px' }} />修改密码</span>
        </Menu.Item>
        <Menu.Item key="exit">
          <img src={exit} style={{ margin: '0 10px 0 5px' }} />
          <div onClick={this.gologin} style={{ display: 'inline', lineHeight: '' }}>
          {/*<Link to={window.routername} style={{ color: 'black', textDecoration: 'none' }}>退出登录</Link>*/}
          退出登录
        </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ minHeight: '100vh' }} className="main-layout">
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}  className="main-slider">
          <Link to="/position">
            <div className={collapsed ? 'small-logo' : 'logo'} />
          </Link>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultKey]}
            defaultOpenKeys={[defaultOpenKeys]}
          >
            {menusList.length ? menusList.map((item) => (item.sub ? (
              <SubMenu
                key={item.key}
                icon={<BarsOutlined />}
                title={item.name}
              >
                {item.sub.length ? item.sub.map((subItem) => (
                  <Menu.Item key={subItem.key} className="main-sub">
                    {subItem.name}
                  </Menu.Item>
                )) : ''}
              </SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                className="main-menu"
                // icon={<DynamicIconFn param={item.icon} />}
                icon={
                  React.createElement(Icon[item.icon], {
                    fontSize: '16px'
                  })
                }
              >
                <Link to={`${item.key}`} style={{ color: 'rgba(255,255,255,.65)' }}>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </Menu.Item>
            )))
              : ''}


          </Menu>
        </Sider>
        <Layout className="layout-right" style={{ width: '90%' }}>
          <Header className="header">
            <Row>
            <Col span={21}>
              {/*{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {*/}
                {/*className: 'trigger',*/}
                {/*onClick: this.onCollapse,*/}
              {/*})}*/}


              {/*农业项目*/}
            </Col>
            <Col span={3} style={{ lineHeight: '63px' }}>
              <Dropdown overlay={menu} placement="bottomLeft">
                <div className="userCenter"><img src={user} style={{ marginRight: '10px'}} /><div style={{ display: 'inline', lineHeight: '30px' }}>用户中心</div></div>
              </Dropdown>
            </Col>
            </Row>

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


//export default PageComponent;
export default withRouter(PageComponent);

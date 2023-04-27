import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import menus from 'localData/menulist.jsx';
import './layout.less';
import $ from 'jquery';
import * as Icon from '@ant-design/icons';
import 'font-awesome/less/font-awesome.less';
import 'react-fontawesome';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PoweroffOutlined
} from '@ant-design/icons';
import TableStore from 'store/tablestore';
import logo from 'images/logo.png';
import HeaderWrap from './header';

const {
  Content, Sider, Header
} = Layout;
const { SubMenu } = Menu;
const store = TableStore;
const globalObj = {};

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`
      };
    })
  };
});

@observer
class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menusList: []
    };
  }

  componentDidMount() {
    // const tempPath = window.location.pathname.split('/');
    this.fetchMenus();
  }

  // componentWillMount() {
  //   // const tempObj = localStorage.getItem('menuObj');
  //
  //   // const tempMenu = tempObj === 'undefined' ? {} : JSON.parse(localStorage.getItem('menuObj'));
  //   // const menusList = menus;
  //   //
  //   // this.setState({
  //   //   menusList
  //   // });
  // }

  fetchMenus = () => {
    const that = this;
    const param = {
      loadingFlag: false,
      url: 'testUrl',
      method: 'GET',
      data: {

      },
      successFn(data) {
        const tempData = that.dealMenus(data.data);
        that.setState({ menusList: tempData });
      }
    };
    store.handleNormal(param);
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  dealMenus(tempdata) {
    const tempList = tempdata.map((item, index) => ({
      key: item.menuid,
      route: item?.url,
      label: item.url ? (
        <Link to={window.routername + item.url} rel="noopener noreferrer">
          {item.menuname}
        </Link>
      ) : item.menuname,
      title: item.menuname,
      icon: item?.faicon,
      children: item.submenus && item.submenus.length ? this.dealMenus(item.submenus) : null
    }));
    return tempList;
  }

  onOpenChange = (keys) => {
    const rootSubmenuKeys = ['service', 'casemanage', 'communitysecurity', 'archives', 'accessControlCard', 'accessControlAuthority'];
    const latestOpenKey = keys.find((key) => store.dataObj.openkeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      // this.setState({ openKeys: keys });

      runInAction(() => {
        store.dataObj.openkeys = keys;
      });
      localStorage.setItem('openkeys', JSON.stringify(keys));
    } else {
      // this.setState({ openKeys: latestOpenKey ? [latestOpenKey] : [] });

      runInAction(() => {
        store.dataObj.openkeys = latestOpenKey ? [latestOpenKey] : [];
      });
      localStorage.setItem('openkeys', JSON.stringify(latestOpenKey ? [latestOpenKey] : []));
    }
  }

  loopMenu = (tempmenus) => {
    const data = tempmenus?.map((item, index) => ({
      ...item,
      theme: 'light',
      icon: React.createElement(
        'i',
        {
          className: item.icon,
          style: {
            fontSize: '16px'

          }
        }
      ),
      children: item.children && item.children.length ? this.loopMenu(item.children) : null
    }));
    return data;
  }

  loopMenu2(list, ico = '', site = '当前位置:') {
    return list.map((item) => {
      // 判断有没有子节点 NO
      if (!item.children) {
        globalObj[window.routername + item.route] = site + ico + item.title;
        // return site + ico + item.title
      } else {
        return this.loopMenu2(item.children, ' / ', site + ico + item.title);
      }
    });
  }

  // renderMenuItem(navList) {
  //   return navList.map((item, index) => {
  //     if (item.sub && item.sub.length) {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={item.name}
  //           icon={React.createElement(
  //             Icon[item.icon],
  //             {
  //               style: {
  //                 fontSize: '16px'

  //               }
  //             }
  //           )}
  //         >
  //           {this.renderMenuItem(item.sub)}
  //         </SubMenu>
  //       );
  //     }
  //     return (
  //       <Menu.Item
  //         icon={React.createElement(
  //           Icon[item.icon],
  //           {
  //             style: {
  //               fontSize: '16px'

  //             }
  //           }
  //         )}
  //         key={item.key}
  //       >
  //         <NavLink to={`${item.key}`}>{item.name}</NavLink>
  //       </Menu.Item>
  //     );
  //   });
  // }

  render() {
    // const project = window.apiUrl.split('/')[3];
    // const { collapsed } = this.state;
    const { children, name } = this.props;
    // const layoutBgc = name === 'dashboard' ? { margin: '14px', backgroundColor: '#e7ebee' } : {
    //   margin: '14px', padding: '20px'
    // };
    let tempOpenkeys = JSON.parse(localStorage.getItem('openkeys'));
    tempOpenkeys = tempOpenkeys === null ? ['service', 'admhouse'] : tempOpenkeys;
    const tempPath = window.location.pathname.split('/');
    const defaultKey = `/${tempPath[1]}/${tempPath[2]}`;// `${tempPath[1]}`;
    // const subRouter = `${tempPath[1]}/${tempPath[2]}`;
    // let defaultKey = '';
    // if (subRouter && subRouter !== '/undefined' && subRouter !== 'smartpark/undefined') {
    //   defaultKey = subRouter.substr(0, 6) === 'device'
    //     ? window.location.search.substr(1, window.location.search.length - 1) : subRouter;
    // } else if (subRouter === '/undefined') {
    //   defaultKey = 'smartpark/community';
    // } else {
    //   defaultKey = 'smartpark/community';
    // }
    // const defaultOpenKeys = '';// `${tempPath[1]}`;
    // const menuList = menusList.list;
    const menuList = this.loopMenu(this.state.menusList);// (menus.list);
    const tempLists = this.loopMenu2(this.state.menusList, '', '');
    return (
      <Layout style={{ minHeight: '100vh', overflowY: 'auto' }} className="main-layout">
        {/* <Header className="header"> */}
        {/*    <div className="logo" > */}
        {/*        <Link to={window.routername}> */}
        {/*            <div className="logo" style={{ background: `url(${logo}) no-repeat center center`, backgroundSize: collapsed ? '23%' : '58%' }} /> */}
        {/*        </Link> */}
        {/*    </div> */}
        {/*    <div style={{fontSize:'18px',color:'#fff'}}>【开发部】GSP联调测试项目 */}
        {/*        <div style={{display:'inline-block',fontSize:'14px',float:'right',marginRight:'20px'}}> */}
        {/*            <UserOutlined />&nbsp;&nbsp;用户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
        {/*            <Link to={window.routername} style={{color:'#fff'}}><PoweroffOutlined />&nbsp;&nbsp;退出</Link> */}
        {/*        </div> */}
        {/*    </div> */}
        {/* </Header> */}
        <HeaderWrap />
        <Content
          style={{
            padding: '0 20px'
          }}
        >
          <div>
            {/* <Breadcrumb
              style={{
                margin: '16px 0',
                width: '20%',
                display: 'inline-block'
              }}
            >
              <Breadcrumb.Item><Link to={`${window.routername}/index`}>首页</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{globalObj[`${defaultKey}`]}</Breadcrumb.Item>
            </Breadcrumb> */}
            <Breadcrumb
              style={{
                margin: '16px 0',
                width: '20%',
                display: 'inline-block'
              }}
              items={[
                {
                  title: <Link to={`${window.routername}/index`}>首页</Link>
                },
                {
                  title: globalObj[`${defaultKey}`]
                }
              ]}
            />

            <Menu
              className="headerMenu"
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={[defaultKey]}
              // defaultOpenKeys={store.dataObj.openkeys.length ? store.dataObj.openkeys : tempOpenkeys || ['service', 'admhouse']}
              // defaultOpenKeys={store.dataObj.openkeys.length === 0 && tempOpenkeys === null ? ['service', 'admhouse'] : store.dataObj.openkeys.length ? store.dataObj.openkeys : tempOpenkeys}
              // openKeys={['archives','smartpark/community']}
              // openKeys={store.dataObj.openkeys.length ? store.dataObj.openkeys : tempOpenkeys}
              // openKeys={store.dataObj.openkeys.length ? store.dataObj.openkeys : tempOpenkeys}
              onOpenChange={this.onOpenChange}
              items={menuList}
              style={{ display: 'inline-block', width: '80%', textAlign: 'right' }}
            />
          </div>
          <Layout
            className="site-layout-background"
            style={{
              padding: '3px 0 10px 0',
              minHeight: '87vh'
            }}
          >
            <Content
              style={{
                padding: '0 24px',
                minHeight: 'calc(100vh - 120px)',
                background: '#fff'
              }}
            >
              {children}
            </Content>
          </Layout>
        </Content>
      </Layout>

    );
  }
}

PageComponent.propTypes = {
  children: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired
};

export default PageComponent;

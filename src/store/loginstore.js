import { observable } from 'mobx';
import Ajax from 'util/ajax';

export default class Logintstore {
  @observable data = {
    list: []
    // menuObj: {
    //  layoutTitle: '智慧社区物联网管理平台',
    //  menulist: []
    // }

  };

  login(param) {
    const params = {
      successFn(data) {
        if (param.querySuccess) {
          param.querySuccess(data);
        }
      },
      ...param
    };
    // // console.log(params);
    Ajax.fetch(params);
  }

  logOut(param) {
    Ajax.fetch(param);
  }
}

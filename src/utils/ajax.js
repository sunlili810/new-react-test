import axios from 'axios';
import modal from 'components/modal/modal';

let dialogId = 0;
const baseUrl = window.apiUrl;
export default class AJAX {
  static fetch(options) {
    const {
      loadingFlag,
      method = 'get',
      successFn,
      errorFn
    } = options;
    if (loadingFlag) {
      dialogId = modal.showModel({
        type: 'loading'
      });
    }
    let { data, url } = options;
    const urlFirst = url.split(':')[0];
    url = urlFirst === 'http' ? url : baseUrl + url;
    if (method.toLowerCase() === 'get') {
      data = null;
    }
    // else {
    // data = JSON.stringify(data);
    // }
    const tempData = AJAX.isExisty(data) ? data : {};
    // const tempData2 = { ...tempData, projectid: window.projectid, deveui: window.deveui };
    const tempData2 = { ...tempData, projectid: localStorage.getItem('PROJECTID') };
    axios({
      method,
      url,
      // headers: { 'Content-Type': 'application/json;charset=UTF-8'},
      // headers: { 'content-type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
      data: tempData2,
      transformRequest: [function (dataOld) {
        let ret = '';
        for (const it in dataOld) {
          let tempValue = null;
          if (Array.isArray(dataOld[it])) {
            tempValue = JSON.stringify(dataOld[it]);
          } else if (typeof dataOld[it] === 'object') {
            tempValue = JSON.stringify(dataOld[it]);
          } else {
            tempValue = dataOld[it];
          }
          // ret += `${encodeURIComponent(it)}=${encodeURIComponent(dataOld[it])}&`;
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(tempValue)}&`;
        }
        return ret;
      }]
    })
      .then((response) => {
        if (loadingFlag) {
          modal.closeModel(dialogId);
        }
        if (response.data.result === 0) {
          if (successFn) {
            successFn(response.data);
          }
        } else if (response.data.result === 1001) {
          window.location.href = window.routername;
        } else if (errorFn) {
          errorFn(response.data.errorMsg);
        } else {
          AJAX.modalError(response.data.errorMsg || response.data.remark);
        }
      }).catch((error) => {
        if (errorFn) {
        // errorFn(error.message);
        } else {
        // AJAX.modalError(error.message);
        }
        if (loadingFlag) {
          modal.closeModel(dialogId);
        }
      });
  }

  static fetchUpload(options) {
    const {
      loadingFlag,
      method = 'get',
      successFn,
      errorFn,
      data
    } = options;
    if (loadingFlag) {
      dialogId = modal.showModel({
        type: 'loading'
      });
    }
    // data.append('projectid', localStorage.getItem('PROJECTID'));
    // data.append('deveui', window.deveui);
    let { url } = options;
    url = baseUrl + url;
    axios({
      method,
      url,
      withCredentials: true,
      data
    })
      .then((response) => {
        if (loadingFlag) {
          modal.closeModel(dialogId);
        }
        if (response.data.result === 0) {
          if (successFn) {
            successFn(response.data);
          }
        } else if (errorFn) {
          errorFn(response.data.errorMsg);
        } else {
          AJAX.modalError(response.data.errorMsg || response.data.detail);
        }
      }).catch((error) => {
        if (errorFn) {
          errorFn(error.message);
        } else {
          AJAX.modalError(error.message);
        }
        if (loadingFlag) {
          modal.closeModel(dialogId);
        }
      });
  }

  static isExisty(obj) {
    return obj !== null;
  }

  static modalError(message) {
    return modal.showModel({
      type: 'error',
      message
    });
  }

  static modalSuccess() {
    return modal.showModel({
      type: 'success',
      message: '指令发送成功'
    });
  }

  static modalHandleSuccess(message) {
    return modal.showModel({
      type: 'success',
      message
    });
  }
}

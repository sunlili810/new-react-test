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
    // if (method.toLowerCase() === 'get') {
    //  data = null;
    // }
    // else {
    // data = JSON.stringify(data);
    // }
    const tempData = AJAX.isExisty(data) ? data : {};
    // const tempData2 = Object.assign({}, tempData, { projectid: window.projectid ,deveui: window.deveui});
    let tempData2;
    if (url.includes('bindingPerson') || url.includes('unbindingPerson')) {
      tempData2 = tempData;
    } else {
      tempData2 = {
        ...tempData, projectId: localStorage.getItem('projectId'), villageId: localStorage.getItem('villageId')
      };
    }

    const methodData = method.toLowerCase() === 'get' ? { params: { ...tempData2 } } : { data: tempData2 };

    // 添加请求拦截器
    axios.interceptors.request.use((config) => {
      if (localStorage.getItem('token')) {
        config.headers.token = localStorage.getItem('token');
      }
      return config;
    }, (error) =>
      // 对请求错误做些什么
      Promise.reject(error));

    // 添加响应拦截器
    axios.interceptors.response.use((response) =>
      // 对响应数据做点什么
      response,
    (error) => {
      // 对响应错误做点什么
      if (error.message.indexOf('401') !== -1) {
        window.location.href = window.routername;
      }
      return Promise.reject(error);
    });

    axios({
      method,
      url,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      // headers: { 'content-type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
      // data: tempData,
      // params:{...tempData2},
      ...methodData
      // transformRequest: [function (dataOld) {
      //   let ret = '';
      //   for (const it in dataOld) {
      //     let tempValue = null;
      //     if (Array.isArray(dataOld[it])) {
      //       tempValue = JSON.stringify(dataOld[it]);
      //     } else if (typeof dataOld[it] === 'object') {
      //       tempValue = JSON.stringify(dataOld[it]);
      //     } else {
      //       tempValue = dataOld[it];
      //     }
      //     // ret += `${encodeURIComponent(it)}=${encodeURIComponent(dataOld[it])}&`;
      //     ret += `${encodeURIComponent(it)}=${encodeURIComponent(tempValue)}&`;
      //   }
      //   return ret;
      // }]
    })
      .then((response) => {
        if (loadingFlag) {
          modal.closeModel(dialogId);
        }
        if (response.status === 200) {
          if (response.data.code !== '200') {
            if (errorFn) {
              errorFn(response.data.msg);
            } else {
              AJAX.modalError(response.data.msg);
            }
          }
          if (successFn) {
            successFn(response.data);
          }
        } else if (response.status === 404 || 401) {
          window.location.href = window.routername;
        } else if (errorFn) {
          errorFn(response.data.msg);
        } else {
          // AJAX.modalError(response.data.errorMsg || response.data.detail);
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
    data.append('projectid', window.projectid);
    data.append('deveui', window.deveui);
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

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Modal, Spin } from 'antd';
import successIcon from 'images/success-icon.png';
import errorIcon from 'images/error-icon.png';
import confirmIcon from 'images/confirm-icon.png';
import confirmClose from 'images/confirm-close.png';

import './modal.less';

class PageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalList: [],
      modalListTwo: null,
      secondModalFlag: false
    };
    this.closeTwo = this.closeTwo.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //  if (this.props.modalList !== nextProps.modalList){
  //
  //  }
  // }
  showTwo(option) {
    this.setState({
      modalListTwo: option,
      secondModalFlag: true
    });
  }

  closeTwo() {
    this.setState({
      secondModalFlag: false
    });
  }

  show(option) {
    const { modalList } = this.state;
    modalList.push(option);

    this.setState({
      modalList
    });
  }

  close(id, func) {
    const { modalList } = this.state;
    let tempList = [];
    if (id) {
      tempList = modalList.filter(item => item.id !== id);
    }
    this.setState({
      modalList: tempList
    }, () => {
      if (typeof func === 'function') {
        func();
      }
    });
  }

  handleConfirm(value) {
    this.close(value.id, value.option.ok);
  }

  handleSuccess(value) {
    this.close(value.id, value.option.ok);
  }

  handleError(value) {
    this.close(value.id);
  }

  eventListener(value, status, data) {
    if (status === 'okBtn') {
      if (value.option.ok) {
        value.option.ok(data);
      }
    }
    this.close(value.id);
  }

  render() {
    const {
      modalList, modalListTwo, secondModalFlag
    } = this.state;
    const tempSecondModal = secondModalFlag ? (
      <div>
        <Modal
          title=""
          wrapClassName="vertical-center-dialog"
          visible
          width={modalListTwo !== null ? modalListTwo.option.width || '520px' : '520px'}
          footer={null}
          className="modal-header"
          onCancel={this.closeTwo}
          maskClosable={false}
          zIndex={1001}
        >
          {
            modalListTwo !== null && modalListTwo.option.Dialog ? (<modalListTwo.option.Dialog onTrigger={this.eventListener.bind(this, modalListTwo)} param={modalListTwo.option.param} />) : ''

          }
        </Modal>
      </div>
    ) : '';

    return (
      <div>
        {
          modalList.map((item) => {
            let content = '';
            if (item.option.type === 'loading') {
              content = (
                <div key={item.id}>
                  <Modal
                    title=""
                    wrapClassName="vertical-center-modal"
                    visible
                    closable={false}
                    footer={null}
                    width="25%"
                    className="modal-spin"
                  >
                    <Spin tip={item.option.title === undefined ? '加载中...' : item.option.title} size="large" />
                  </Modal>
                </div>
              );
            } else if (item.option.type === 'error') {
              content = (
                <div key={item.id}>
                  <Modal
                    title=""
                    wrapClassName="vertical-center-modal"
                    visible
                    closable={false}
                    footer={null}
                    width="25%"
                    className="modal-error"
                  >
                    <div className="content">
                      <img
                        className="close"
                        style={{
                          wordWrap: 'break-word',
                          wordBreak: 'break-all',
                          whiteSpace: 'pre-wrap',
                          textAlign: 'left',
                          padding: '10px',
                          fontSize: '16px'
                        }}
                        src={confirmClose}
                        onClick={this.close.bind(this, item.id)}
                        role="presentation"
                        alt="close"
                      />
                      <div className="noti">
                        <img className="img" src={errorIcon} alt="" />
                        <p className="text">
                          {item.option.message}
                        </p>
                      </div>
                      <div className="btn" onClick={this.handleError.bind(this, item)} role="presentation">确定</div>
                    </div>
                  </Modal>
                </div>
              );
            } else if (item.option.type === 'success') {
              content = (
                <div key={item.id}>
                  <Modal
                    title=""
                    wrapClassName="vertical-center-modal"
                    visible
                    footer={null}
                    width="26%"
                    className="modal-success"
                    maskClosable={false}
                    closable={false}
                  >
                    <div className="content">
                      <img className="close" src={confirmClose} alt="close" onClick={this.close.bind(this, item.id)} role="presentation" />
                      <div className="noti">
                        <img className="img" src={successIcon} alt="" />
                        <p className="text">
                          {item.option.message}
                        </p>
                      </div>
                      <div className="btn" onClick={this.handleSuccess.bind(this, item)} role="presentation">确定</div>
                    </div>
                  </Modal>
                </div>
              );
            } else if (item.option.type === 'confirm') {
              content = (
                <div key={item.id}>
                  <Modal
                    title=""
                    wrapClassName="vertical-center-modal"
                    visible
                    footer={null}
                    width="26%"
                    className="modal-confirm"
                    maskClosable={false}
                    closable={false}
                    centered
                  >
                    <div className="content">
                      <img className="close" src={confirmClose} alt="close" onClick={this.close.bind(this, item.id)} role="presentation" />
                      <div className="noti">
                        <img className="img" src={confirmIcon} alt="" />
                        <p className="text">
                          {item.option.message}
                        </p>
                      </div>
                      <div className="btn" onClick={this.handleConfirm.bind(this, item)} role="presentation">确定</div>
                    </div>
                  </Modal>
                </div>
              );
            } else if (item.option.type === 'dialog') {
              content = (
                <div key={item.id}>
                  <Modal
                    title={item.option.title}
                    wrapClassName="vertical-center-dialog"
                    visible
                    width={item.option.width === undefined ? '520px' : item.option.width}
                    footer={null}
                    className="modal-header"
                    onCancel={this.close.bind(this, item.id, undefined)}
                    maskClosable={false}
                  >
                    {
                      item.option.Dialog ? (<item.option.Dialog onTrigger={this.eventListener.bind(this, item)} param={item.option.param} />) : ''
                    }
                  </Modal>
                </div>
              );
            }
            return content;
          })
        }
        {tempSecondModal}
      </div>
    );
  }
}

let newId = 1;
const dialogDom = ReactDom.render(<PageComponent />, document.getElementById('dialog'));
const modal = {};

modal.showModel = (option) => {
  newId += 1;
  dialogDom.show({
    id: newId,
    option
  });
  return newId;
};

modal.closeModel = (id) => {
  if (id) {
    dialogDom.close(id);
  } else {
    dialogDom.close();
  }
};

modal.showModelTwo = (option) => {
  newId += 1;
  dialogDom.showTwo({
    id: newId,
    option
  });
  return newId;
};
modal.closeModelTwo = (id) => {
  if (id) {
    dialogDom.closeTwo(id);
  } else {
    dialogDom.closeTwo();
  }
};

export default modal;

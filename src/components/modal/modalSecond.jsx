import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Modal } from 'antd';
import './modal.less';

class PageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalListTwo: null,
      secondModalFlag: false
    };
    this.closeTwo = this.closeTwo.bind(this);
  }

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
      modalListTwo, secondModalFlag
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

        {tempSecondModal}
      </div>
    );
  }
}

let newId = 1;
const dialogDom = ReactDom.render(<PageComponent />, document.getElementById('dialog2'));
const modal = {};
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

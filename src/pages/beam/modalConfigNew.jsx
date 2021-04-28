import React, { Component } from 'react';
import {
  Form, Input, Button, Select, InputNumber, Modal, message
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import modalSecond from 'components/modal/modalSecond';

const store = new tablestore();
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
};
const upsftodownsfdelaytsnumList = Array.from({ length: 40 }, (item, index) => ({
  id: index,
  name: `${index + 1}`
}));
@observer
class modalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandids: null,
      siBandids: null
    };
    this.handleOk = this.handleOk.bind(this);
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
  }

  componentDidMount() {
    const templist = this.props.recordData === null ? [] : toJS(this.props.recordData.bandinfolist);
    const templistSI = this.props.recordData === null ? [] : toJS(this.props.recordData.sibandlist);
    const bandids = templist.length ? templist.map((item) => (item.bandid)) : [];


    const bandidsSI = templistSI.length ? templistSI.map((item) => (item.sibandid)) : [];
    const temparry = bandidsSI.sort((x, y) => x - y);
    this.setState({
      bandids,
      siBandids: temparry
    });
  }

  handleOk() {
 
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      if (values.bandinfolist === undefined && this.props.recordData === null) {
        message.warning('');
        return;
      }
      if (values.sibandlist === undefined && this.props.recordData === null) {
        message.warning('');
        return;
      }
      // const tempBitmapTen = parseInt(values.accesscarrierbitmap, 2);
      // const tempBitmapSix = tempBitmapTen.toString(16);


      const data = {
        ...values,
        bandinfolist: values.bandinfolist === undefined ? toJS(this.props.recordData.bandinfolist) : values.bandinfolist,
        sibandlist: values.sibandlist === undefined ? toJS(this.props.recordData.sibandlist) : values.sibandlist,
      };
      if (this.props.recordData === null) {
        this.props.handleAdd(data);
        store.dataObj.bandinfolist = [];
        store.dataObj.siBandinfolist = [];
      } else {
        this.props.handleEdit(data);
      }
    });
  }

  cancelClickHandler() {
    // this.props.onTrigger('cancelBtn');
    this.props.cancelClickHandler('cancelBtn');
  }

  showAcctmapConfig = (e) => {
    modalSecond.showModelTwo({
      type: 'dialog',
      title: '',
      width: '750px',
      Dialog: acctmapConfig,
      ok: (value) => {
        // this.props.form.setFieldsValue({ accesscarrierbitmap: value.accesscarrierbitmap });
      },
      param: {
        // accesscarrierbitmap: e.target.value
      }
    });
  };

  showAcctmapConfigBand = (e) => {
    // const bandinfolist = [
    //   { bandid: 2, desiredchannelbitmap: '0011111111111111' },
    //   { bandid: 12, desiredchannelbitmap: '1111111111111100' },
    //   { bandid: 3, desiredchannelbitmap: '1001111111111100' }
    // ];

    const bandinfolist = this.props.recordData === null ? [] : toJS(this.props.recordData.bandinfolist);
    const tempbandinfolist = bandinfolist.map((item) => {
      const accesscarrierbitmap = item.desiredchannelbitmap ? parseInt(item.desiredchannelbitmap, 16) : '';
      const tempTwo = accesscarrierbitmap.toString(2);
      return {
        bandid: item.bandid,
        desiredchannelbitmap: tempTwo
      };
    });

    modalSecond.showModelTwo({
      type: 'dialog',
      title: '',
      width: '1050px',
      Dialog: acctmapConfigBand,
      ok: (value) => {
        // window.localStorage.setItem('selectedBand', JSON.stringify(value.bandids));
        window.localStorage.setItem('selectedBand', JSON.stringify(value.bandinfolist));


        store.dataObj.bandinfolist = [];
        store.dataObj.bandinfolist = value.bandinfolist.map((item) => {
          const accesscarrierbitmap = item.desiredchannelbitmap ? parseInt(item.desiredchannelbitmap, 16) : '';
          const tempTwo = accesscarrierbitmap.toString(2);
          return {
            bandid: item.bandid,
            desiredchannelbitmap: tempTwo
          };
        });
        const temparry = value.bandids.sort((x, y) => x - y);

        this.setState({
          bandids: temparry.toString()
        });
        this.props.form.setFieldsValue({ bandinfolist: value.bandinfolist });
        this.props.form.setFieldsValue({ bandid: '' });
      },
      param: {
        // bandinfolist: tempbandinfolist.length === 0 && store.dataObj.bandinfolist.length ? toJS(store.dataObj.bandinfolist) : tempbandinfolist
        bandinfolist: store.dataObj.bandinfolist.length ? toJS(store.dataObj.bandinfolist) : tempbandinfolist
      }
    });
  };

  showAcctmapConfigSIBand = (e) => {
    const bandinfolist = this.props.recordData === null ? [] : toJS(this.props.recordData.sibandlist);
    const tempbandinfolist = bandinfolist.map((item) => {
      const accesscarrierbitmap = item.accesscarrierbitmap ? parseInt(item.accesscarrierbitmap, 16) : '';
      const tempTwo = accesscarrierbitmap.toString(2);
      return {
        bandid: item.sibandid,
        desiredchannelbitmap: tempTwo
      };
    });
    modalSecond.showModelTwo({
      type: 'dialog',
      title: '',
      width: '1050px',
      Dialog: acctmapConfigSIBand,
      ok: (value) => {
        const temparry = value.bandids.sort((x, y) => x - y);
        store.dataObj.siBandinfolist = [];
        store.dataObj.siBandinfolist = value.bandinfolist.map((item) => {
          const accesscarrierbitmap = item.accesscarrierbitmap ? parseInt(item.accesscarrierbitmap, 16) : '';
          // const tempTwoBinary = accesscarrierbitmap.toString(2).length<16?[...new Array(16-accesscarrierbitmap.toString(2).length).fill(0),...accesscarrierbitmap.toString(2)]:accesscarrierbitmap.toString(2);
          const tempTwo = accesscarrierbitmap.toString(2);
          return {
            bandid: item.sibandid,
            desiredchannelbitmap: tempTwo
            // desiredchannelbitmapBinary:tempTwoBinary
          };
        });

        this.setState({
          siBandids: temparry.toString()
        });
        this.props.form.setFieldsValue({ sibandlist: value.bandinfolist });
      },
      param: {
        // bandinfolist: tempbandinfolist.length === 0 && store.dataObj.siBandinfolist.length ? toJS(store.dataObj.siBandinfolist) : tempbandinfolist// tempbandinfolist
        bandinfolist: store.dataObj.siBandinfolist.length ? toJS(store.dataObj.siBandinfolist) : tempbandinfolist
      }
    });
  };


    const that = this;
    const params = {
      loadingFlag: false,
      url: '',
      method: 'POST',
      data: {
        ...param
      },
      successFn(data) {
        const templeteData = JSON.parse(data.data.content);
        const tempAccesscarrierbitmap = parseInt(templeteData.accesscarrierbitmap, 16).toString(2);
        const textArry = [...tempAccesscarrierbitmap];
        const deffNum = 16 - textArry.length;
        const zeroArry = new Array(deffNum).fill(0);
        const newText = [...zeroArry, ...textArry].join('');

        that.props.form.setFieldsValue({
          // accesscarrierbitmap: newText,
        });
      }
    };
    store.handleNormal(params);
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { bandids, siBandids } = this.state;
    const selectedBand = window.localStorage.getItem('selectedBand') !== '' && window.localStorage.getItem('selectedBand') !== null ? JSON.parse(window.localStorage.getItem('selectedBand')) : [];
    return (
      <div className="beamConfig" style={{ position: 'relative' }}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <div className="beamconfigLeft">


          <div className="beamconfigRight">
            <div className="basMess">
              <div className="basMess" style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.showAcctmapConfigBand.bind(this)}>
                  测试配置1
                </Button>
                <div className="bandidWrap">{bandids !== null ? `已选择：${bandids}` : ''}</div>
                <FormItem label="" hasFeedback {...formItemLayout} style={{ display: 'none', width: '90%' }}>
                  {getFieldDecorator('bandinfolist', {
                    rules: [
                      {
                        required: false,
                        message: ''
                      }
                    ]
                  })(
                    <TextArea autoComplete="off" readOnly style={{ resize: 'none' }} />
                  )}
                </FormItem>
              </div>
              <div className="nextBeam" style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.showAcctmapConfigSIBand.bind(this)}>
                  测试配置2
                </Button>
                <div className="bandidWrap">{siBandids !== null ? `已选择：${siBandids}` : ''}</div>
                <FormItem label="" hasFeedback {...formItemLayout} style={{ display: 'none', width: '90%' }}>
                  {getFieldDecorator('sibandlist', {
                    rules: [
                      {
                        required: false,
                        message: ''
                      }
                    ]
                  })(
                    <Input autoComplete="off" readOnly />
                  )}
                </FormItem>
              </div>
            </div>
			
  

            <FormItem
              wrapperCol={{ span: 24 }}
              className="footer"
              style={{ textAlign: 'center' }}
            >
              <Button type="primary" htmlType="submit" onClick={this.handleOk}>
                确定
              </Button>
              <Button style={{ marginLeft: 8, marginRight: 8 }} onClick={this.cancelClickHandler}>
                取消
              </Button>
            </FormItem>
          </div>


        </Form>
      </div>
    );
  }
}

modalComponent.propTypes = {
  form: PropTypes.object.isRequired
  // param: PropTypes.object.isRequired,
  // onTrigger: PropTypes.func.isRequired
};

export default Form.create({
  mapPropsToFields(props) {
    const { recordData } = props;
    // const accesscarrierbitmap = recordData === null ? '1111111111111111' : recordData.accesscarrierbitmap ? parseInt(recordData.accesscarrierbitmap, 16).toString(2) : '1111111111111111';


    // const textArry = [...accesscarrierbitmap];
    // const deffNum = 16 - textArry.length;
    // const zeroArry = new Array(deffNum).fill(0);
    // const newText = [...zeroArry, ...textArry].join('');
    return {
    
      // accesscarrierbitmap: Form.createFormField({ value: newText }),


    };
  }
})(modalComponent);

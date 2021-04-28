import React, { Component } from 'react';
import {
  Form, Button, Select, Checkbox, Row, Col, Input, Icon
} from 'antd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';


const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  }
};
const checkList = [
  {
    label: '15',
    index: 15
  },
  {
    label: '14',
    index: 14
  },
  {
    label: '13',
    index: 13
  },
  {
    label: '12',
    index: 12
  },
  {
    label: '11',
    index: 11
  },
  {
    label: '10',
    index: 10
  },
  {
    label: '9',
    index: 9
  },
  {
    label: '8',
    index: 8
  },
  {
    label: '7',
    index: 7
  },
  {
    label: '6',
    index: 6
  },
  {
    label: '5',
    index: 5
  },
  {
    label: '4',
    index: 4
  },
  {
    label: '3',
    index: 3
  },
  {
    label: '2',
    index: 2
  },
  {
    label: '1',
    index: 1
  },
  {
    label: '0',
    index: 0
  }
];
const bandids = new Array(56).fill({
  bandid: 1, desiredchannelbitmap: ''
}).map((item, index) => (
  { bandid: index + 1, desiredchannelbitmap: '1111111111111111' }
));
@observer
class modalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandidlist: []
    };
    this.handleOk = this.handleOk.bind(this);
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
    this.onChangeDefault = this.onChangeDefault.bind(this);
    this.resetSelect = this.resetSelect.bind(this);
    this.onChangeBand = this.onChangeBand.bind(this);
  }

  componentDidMount() {
    const { bandinfolist } = this.props.param;
    // const bandinfolist = [
    //   { bandid: 2, desiredchannelbitmap: '0011111111111111' },
    //   { bandid: 12, desiredchannelbitmap: '1111111111111100' },
    //   { bandid: 3, desiredchannelbitmap: '1001111111111100' }
    // ];
    const tempBandids = [];
    const totalData = bandinfolist ? bandinfolist.map((item, index) => {
      tempBandids.push(item.bandid);
      const selectedIndex = [];
      [...item.desiredchannelbitmap].reverse().filter((item, index) => {
        if (item === '1') {
          selectedIndex.push(index);
        }
        return selectedIndex;
      });
      return {
        ...item,
        chooseAccbitmap: selectedIndex
      };
    }) : [];

    this.setState({ bandidlist: totalData });
  }

  handleOk() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      const bandinfolist = values.bandids.map((item, index) => {
        const tempBitmapTen = parseInt(values[`accesscarrierbitmap${item}`], 2);
        const tempBitmapSix = tempBitmapTen.toString(16);
        return {
          bandid: parseInt(item),
          desiredchannelbitmap: tempBitmapSix
        };
      });
      const data = {
        bandids: values.bandids,
        bandinfolist
      };
      this.props.onTrigger('okBtn', data);
    });
  }

  cancelClickHandler() {
    this.props.onTrigger('cancelBtn');
  }

  onChangeDefault(bandid, checkedValues) {
    const tempArry = new Array(16).fill(0);
    checkedValues.map((item) => {
      tempArry[item] = 1;
      return tempArry;
    });
    const twoBitNum = tempArry.reverse().toString().replace(/,/g, '');
    this.props.form.setFieldsValue({ [`accesscarrierbitmap${bandid}`]: twoBitNum });
  }

  onChangeBand(checkedValues) {
    const { bandidlist } = this.state;
    const tempBands = bandidlist.map((item, index) => parseInt(item.bandid));
    const tempBandsOut = checkedValues.filter((item) => tempBands.indexOf(item) === -1);
    const arry1 = tempBandsOut.map((item) => (
      { bandid: item, desiredchannelbitmap: '1111111111111111', chooseAccbitmap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }
    ));
    const newBandsList = [...arry1, ...bandidlist];
    const arry2 = newBandsList.filter((item) => checkedValues.indexOf(parseInt(item.bandid)) === -1);
    arry2.map((item) => {
      newBandsList.splice(newBandsList.findIndex((item3) => item3.bandid === item.bandid), 1);
    });
    this.setState({ bandidlist: newBandsList });
  }

  resetSelect() {
    this.props.form.setFields({ chooseAccbitmap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
    this.props.form.setFieldsValue({ accesscarrierbitmap: '0000000000000000' });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { bandidlist } = this.state;
    const bandidsDefaultVal = bandidlist.map((item, index) => parseInt(item.bandid));
    return (
      <div className="shUserConfig" style={{ position: 'relative' }}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
         
          <FormItem label="" {...formItemLayout}>
            {getFieldDecorator('bandids', {
              initialValue: bandidsDefaultVal,
              rules: [
                {
                  required: false,
                  message: ''
                }
              ]
            })(
              <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeBand}>
                <Row>
                  {
                    bandids.map((item, index) => (
                      <Col span={2} key={index}>
                        <Checkbox value={item.bandid}>{item.bandid}</Checkbox>
                      </Col>
                    ))
                  }
                </Row>
              </Checkbox.Group>
            )}
          </FormItem>
          <div className="borderLine" />
          <div className="bangConfigList">
            {
              bandidlist.map((item, index) => (
                <div className="bandvalus" key={index}>
                  <div className="bandTit">{item.bandid}：</div>
                  <div className="bandResult">
                    <FormItem label="" {...formItemLayout}>
                      {getFieldDecorator(`accesscarrierbitmap${item.bandid}`, {
                        initialValue: item.desiredchannelbitmap.length < 16 ? [...new Array(16 - item.desiredchannelbitmap.length).fill('0'), ...item.desiredchannelbitmap].join('') : [...item.desiredchannelbitmap].join(''), // item.desiredchannelbitmap,
                        rules: [
                          {
                            required: true,
                            message: '请选择'
                          }
                        ]
                      })(<Input style={{ width: '145px' }} readOnly />)}
                    </FormItem>
                  </div>
                  <div className="bandMap">
                    <FormItem label="" {...formItemLayout}>
                      {getFieldDecorator(`chooseAccbitmap${item.bandid}`, {
                        initialValue: item.chooseAccbitmap,
                        rules: [
                          {
                            required: false,
                            message: ''
                          }
                        ]
                      })(
                        <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeDefault.bind(this, item.bandid)}>
                          <Row className="bitmapRow">
                            {
                                checkList.map((item, index) => (
                                  <span style={{ display: 'inline-block', width: '45px' }} key={index}>
                                    <Checkbox value={item.index}>{item.label}</Checkbox>
                                  </span>
                                ))
                              }
                          </Row>
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  </div>
                </div>
              ))
            }
          </div>

          <FormItem
            wrapperCol={{ span: 24 }}
            className="footer"
            style={{ textAlign: 'center' }}
          >
            <Button type="primary" htmlType="submit" onClick={this.handleOk}>
              确定
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.cancelClickHandler}>
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

modalComponent.propTypes = {
  form: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  onTrigger: PropTypes.func.isRequired
};

export default Form.create(
)(modalComponent);

import React, { Component } from 'react';
import {
  Form, Button, Select, Checkbox, Row, Col, Input, message
} from 'antd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import './beam.less';

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

}).map((item, index) => (
  { bandid: index + 1, desiredchannelbitmap: '1111111111111111' }
));
@observer
class modalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandidlist: [],
      siBandLength: 1,
      bandidsDefaultVal: []
    };
    this.handleOk = this.handleOk.bind(this);
    this.cancelClickHandler = this.cancelClickHandler.bind(this);
    this.onChangeDefault = this.onChangeDefault.bind(this);
    this.onChangeBand = this.onChangeBand.bind(this);
    this.handleLengthChange = this.handleLengthChange.bind(this);
  }

  componentDidMount() {
    const { bandinfolist } = this.props.param;
    const selectedBand = window.localStorage.getItem('selectedBand') !== '' && window.localStorage.getItem('selectedBand') !== null ? JSON.parse(window.localStorage.getItem('selectedBand')) : [];
    const tempIds = selectedBand.map((item) => parseInt(item.bandid));
    const temparry = bandinfolist.filter((item) => tempIds.indexOf(parseInt(item.bandid)) === -1);
    temparry.map((item) => {
      bandinfolist.splice(bandinfolist.findIndex((item3) => parseInt(item3.bandid) === parseInt(item.bandid)), 1);
    });

    const tempBandids = [];
    // console.log(bandinfolist);
    const totalData = bandinfolist ? bandinfolist.map((item, index) => {
      tempBandids.push(parseInt(item.bandid));
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

    this.setState({ bandidlist: totalData, bandidsDefaultVal: tempBandids, siBandLength: tempBandids.length === 0 ? 1 : tempBandids.length });
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
          sibandid: item,
          accesscarrierbitmap: tempBitmapSix
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
    const { bandidlist, siBandLength } = this.state;
    if (checkedValues.length > siBandLength) {
      message.warning(`请选择${siBandLength}`);
      checkedValues.splice(siBandLength, (checkedValues.length - siBandLength));
    }
    const tempBands = bandidlist.map((item, index) => parseInt(item.bandid));
    const tempBandsOut = checkedValues.filter((item) => tempBands.indexOf(item) === -1);

    const selectedBand = window.localStorage.getItem('selectedBand') !== '' && window.localStorage.getItem('selectedBand') !== null ? JSON.parse(window.localStorage.getItem('selectedBand')) : [];
    const tempselectedBand = selectedBand.length ? selectedBand.map((item) => {
      const accesscarrierbitmap = item.desiredchannelbitmap ? parseInt(item.desiredchannelbitmap, 16) : '';
      const tempTwo = accesscarrierbitmap.toString(2);
      return {
        ...item,
        bandid: parseInt(item.bandid),
        maxNum: 16 - tempTwo.length
      };
    }) : [];

    const arry1 = tempBandsOut.map((item) => {
      const tempsec = tempselectedBand.filter((itemSec) => itemSec.bandid === item);
      const zeroArry = new Array(tempsec[0].maxNum).fill(0);
      const newText = [...zeroArry, ...new Array(16 - tempsec[0].maxNum).fill(1)];

      const sixB = parseInt(tempsec[0].desiredchannelbitmap, 16).toString(2);
      const selectedIndex = [];
      [...sixB].reverse().filter((item, index) => {
        if (item === '1') {
          selectedIndex.push(index);
        }
      });
      // return selectedIndex;
      return { bandid: item, desiredchannelbitmap: sixB, chooseAccbitmap: selectedIndex };
    });
    const newBandsList = [...arry1, ...bandidlist];
    const arry2 = newBandsList.filter((item) => checkedValues.indexOf(parseInt(item.bandid)) === -1);
    arry2.map((item) => {
      newBandsList.splice(newBandsList.findIndex((item3) => item3.bandid === item.bandid), 1);
    });
    this.setState({ bandidlist: newBandsList });
  }

  handleLengthChange(value) {
    this.setState({ siBandLength: value });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { bandidlist, bandidsDefaultVal, siBandLength } = this.state;
    const selectedBand = window.localStorage.getItem('selectedBand') !== '' && window.localStorage.getItem('selectedBand') !== null ? JSON.parse(window.localStorage.getItem('selectedBand')) : [];
    const tempselectedBand = selectedBand.length ? selectedBand.map((item) => {
      const accesscarrierbitmap = item.desiredchannelbitmap ? parseInt(item.desiredchannelbitmap, 16) : '';
      const tempTwo = accesscarrierbitmap.toString(2);
      const tempTwoBinary = tempTwo.length < 16 ? [...new Array(16 - tempTwo.length).fill('0'), ...tempTwo] : [...tempTwo];


      return {
        ...item,
        bandid: parseInt(item.bandid),
        maxNum: 16 - tempTwo.length,
        binary: tempTwoBinary
      };
    }) : [];
    // console.log(tempselectedBand);
    // console.log(bandidlist);
    bandidlist.map((item) => {
      const tempTwoBinary = item.desiredchannelbitmap.length < 16 ? [...new Array(16 - item.desiredchannelbitmap.length).fill(0), ...item.desiredchannelbitmap] : [...item.desiredchannelbitmap];
      // console.log(tempTwoBinary);
      return {
        ...item,
        desiredchannelbitmapBinary: ''
      };
    });
    return (
      <div className="shUserConfig" style={{ position: 'relative' }}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <div style={{ color: '#1C9CBD', marginBottom: '10px' }}>：</div>
          <div>
            <Select defaultValue={siBandLength || 1} key={siBandLength || 1} style={{ width: 120 }} onChange={this.handleLengthChange}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </div>
          <div></div>
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
                    tempselectedBand && tempselectedBand.length ? tempselectedBand.map((item, index) => (
                      <Col span={2} key={index}>
                        <Checkbox value={item.bandid}>{item.bandid}</Checkbox>
                      </Col>
                    )) : []
                  }
                </Row>
              </Checkbox.Group>
            )}
          </FormItem>
          <div className="borderLine" />
          <div className="bangConfigList">
            {
              bandidlist.length ? bandidlist.map((item, index) => (

                <div className="bandvalus" key={index}>
                  <div className="bandTit">{item.bandid}：</div>
                  <div className="bandResult">
                    <FormItem label="" {...formItemLayout}>
                      {getFieldDecorator(`accesscarrierbitmap${item.bandid}`, {
                        initialValue: item.desiredchannelbitmap.length < 16 ? [...new Array(16 - item.desiredchannelbitmap.length).fill(0), ...item.desiredchannelbitmap].join('') : [...item.desiredchannelbitmap].join(''), // item.desiredchannelbitmap,
                        rules: [
                          {
                            required: true,
                            message: ''
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

                              tempselectedBand.filter((itemSec) => itemSec.bandid === parseInt(item.bandid))[0].binary.map((itemBia, indexBia) => {
                                let temphtml = '';
                                itemBia === '1'
                                  ? temphtml = (
                                    <span style={{ display: 'inline-block', width: '45px' }} key={indexBia}>
                                      <Checkbox checked value={15 - indexBia}>{15 - indexBia}</Checkbox>
                                    </span>
                                  )
                                  : temphtml = (
                                    <span style={{ display: 'inline-block', width: '45px' }} key={indexBia}>
                                      <Checkbox disabled checked={false} value={15 - indexBia}>{15 - indexBia}</Checkbox>
                                    </span>
                                  );
                                return temphtml;
                              })

                            }
                          </Row>
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  </div>
                </div>
              )) : []
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

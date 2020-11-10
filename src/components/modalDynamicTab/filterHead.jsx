import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Input, Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class pageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.searchListFn = this.searchListFn.bind(this);
  }

  componentDidMount() {
  }

  searchListFn() {
    const { validateFields } = this.props.form;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const data = {
        ...values
      };
      const { filterHead } = this.props;
      const { searchFn } = filterHead;
      searchFn(data);
    });
  }


  render() {
    const { form, filterHead } = this.props;
    const { filterlist } = filterHead;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ display: 'inline-block', textAlign: 'left', verticalAlign: 'middle' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'inline-block', textAlign: 'left', verticalAlign: 'middle' }}>
            {
              filterlist.map((item) => {
                let filterCont = '';
                switch (item.type) {
                  case 'text':
                    filterCont = (
                      <FormItem key={item.key} label={item.label} hasFeedback {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} style={{ display: 'inline-block', marginRight: '10px' }}>
                        {getFieldDecorator(item.key, {
                          rules: [
                            {
                              required: false,
                              message: ''
                            }
                          ]
                        })(<Input />)}
                      </FormItem>
                    );
                    break;
                  case 'select':
                    filterCont = (
                      <FormItem key={item.key} label={item.label} hasFeedback {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} style={{ minWidth: '200px', display: 'inline-block' }}>
                        {getFieldDecorator(item.key, {
                          // initialValue: item.list.length ? item.list[0].id : '',
                          rules: [
                            {
                              required: item.isRequired,
                              message: '请选择设备类型'
                            }
                          ]
                        })(<Select
                          // className="spaceOperaor"
                          placeholder="请选择"
                          optionFilterProp="children"
                          // onChange={this.handleModelChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            item.list.map(item => (<Option key={item.id} value={item.id}>{item.value}</Option>))
                          }
                        </Select>)}
                      </FormItem>
                    );
                    break;
                  default:
                    break;
                }
                return filterCont;
              })
            }

          </div>

          <div style={{
            display: 'inline-block', textAlign: 'left', minWidth: '100px', marginLeft: '10px', verticalAlign: 'middle'
          }}
          >
            <FormItem
              wrapperCol={{ span: 24 }}
              className="footer"
            >
              <Button type="primary" onClick={this.searchListFn}>查询</Button>
            </FormItem>
          </div>
        </div>
      </Form>
    );
  }
}

pageComponent.propTypes = {
  form: PropTypes.object.isRequired,
  filterHead: PropTypes.object.isRequired
};
export default Form.create()(pageComponent);

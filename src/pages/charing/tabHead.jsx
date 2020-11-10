import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, TreeSelect, Button, Divider, Input
} from 'antd';

const FormItem = Form.Item;
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
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const data = {
        ...values
      };
      const { searchFn } = this.props;
      searchFn(data);
    });
  }


  render() {
    const {
      addUser, deletMany, openLock, param
    } = this.props;
    return (
      <Form
        layout="horizontal"
        onSubmit={this.handleSubmit}
        style={{
          display: 'inline-block', textAlign: 'left', verticalAlign: 'middle', width: '100%'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-block', textAlign: 'left', minWidth: '311px', marginLeft: '10px'
          }}
          >
            <FormItem
              wrapperCol={{ span: 24 }}
              className="footer"
            >
              <Button className="btn-add" type="primary" onClick={addUser}>添加</Button>
            </FormItem>
          </div>
        </div>
      </Form>
    );
  }
}

pageComponent.propTypes = {
  addUser: PropTypes.func.isRequired,
  deletMany: PropTypes.func.isRequired,
  searchFn: PropTypes.func.isRequired,
  param: PropTypes.array.isRequired
};
// export default Form.create()(pageComponent);
export default pageComponent;

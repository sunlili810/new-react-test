import React, { Component } from 'react';
import echarts from 'echarts';
// import  'echarts-gl';
import 'echarts-liquidfill';
import PropTypes from 'prop-types';


class PageComponent extends Component {
  static resizePie(chartid) {
    window[chartid] = echarts.getInstanceByDom(document.getElementById(chartid));
    window[chartid].resize();
  }
  componentDidMount() {
    window[this.props.id] = echarts.init(document.getElementById(this.props.id));
    this.initPie();
    const that = this;
    $(window).on('resize', () => {
      window[that.props.id].resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps;
      this.initPie();
    }
  }

  componentWillUnmount() {
    $(window).off('resize');
    if (window[this.props.id]) {
      window[this.props.id].dispose();
    }
    window[this.props.id] = null;
  }

  initPie() {
    const { param } = this.props;
    const tempData = (param.data).toString() === '0' ? [] : param.data;

    const option = {
      series: [{
        type: 'liquidFill',
        data: tempData,
        amplitude: param.amplitude === undefined ? '2%' : param.amplitude,
        waveAnimation: param.waveAnimation === undefined ? true : param.waveAnimation,
        color: param.color === undefined ? ['#42B8F9'] : param.color,
        label: {
          normal: {
            formatter() {
              return param.depth;
            },
            // textStyle: {
            // color: 'red',
            // insideColor: 'yellow',
            fontSize: 20
            // }
          }
        },
        shape: 'container',

        outline: {
          show: false
        },
        itemStyle: {
          shadowBlur: 0,
          opacity: 0.9
        },
        backgroundStyle: {
          color: '#ffffff',
          borderColor: '#000',
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
          shadowBlur: 0
        },
        emphasis: {
          itemStyle: {
            opacity: 0.95
          }
        }
      }]
    };
    window[this.props.id].setOption(option);
  }

  render() {
    return (
      <div id={this.props.id} style={{ width: '100%', height: '100%' }} />
    );
  }
}

PageComponent.propTypes = {
  // param: PropTypes.number.isRequired
};
export default PageComponent;

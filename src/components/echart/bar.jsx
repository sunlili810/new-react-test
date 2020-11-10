import React, { Component } from 'react';
import echarts from 'echarts';
// import PropTypes from 'prop-types';
import $ from 'jquery';

class PageComponent extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    window[this.props.id] = echarts.init(document.getElementById(this.props.id));
    this.initLines();
    const that = this;
    $(window).on('resize', () => {
      window[that.props.id].resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps;
      this.initLines();
    }
  }

  componentWillUnmount() {
    $(window).off('resize');
    window[this.props.id] = null;
  }

  initLines() {
    const { param } = this.props;
    const tempArry = [];
    param.serrydata.map((item) => {
      const tempObj = {};
      tempObj.type = 'bar';
      tempObj.areaStyle = item.areaStyle === null ? null : {
        normal: {
          color: '#EFF9FC'
        }
      };
      tempObj.smooth = item.smooth ? item.smooth : false;
      tempObj.symbolSize = item.symbolSize ? item.symbolSize : 5;
      tempObj.name = item.name;
      tempObj.barWidth = 20;// x轴柱状的宽度
      tempObj.label = {
        normal: {
          show: true,
          color: '#800000',
          position: 'top' // 在...显示
        }
      };
      if (item.yAxisIndex !== undefined) {
        tempObj.yAxisIndex = item.yAxisIndex;
      }
      tempObj.itemStyle = {
        normal: {
          // 柱形图圆角，初始化效果
          barBorderRadius: [7, 7, 7, 7]
          // label: {
          //   show: true, // 是否展示
          //   textStyle: {
          //     fontWeight: 'bolder',
          //     fontSize: '12',
          //     fontFamily: '微软雅黑'
          //   }
        }
      };
      tempObj.data = item.data;
      tempArry.push(tempObj);
      return tempArry;
    });
    const option = {
      title: {
        text: param.title,
        x: 'center',
        textStyle: {
          color: '#228B22',
        }
      },
      legend: param.legend,
      color: ['#2EBDFF', '#53FED9', '#60B1CC', '#CFA448', '#6ED6C2', '#6C85BD', '#BAC3D2', '#F45C47'],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '4%',
        right: '8%',
        bottom: '8%',
        top: '10%',
        containLabel: true,
        borderWidth: 1,
        borderColor: '#666666'
      },
      xAxis: [{
        type: 'category',
        axisLabel: {
          textStyle: {
            color: param.colorOption === undefined ? '#800000' : param.colorOption.xTxtColor // x轴，y轴的数字颜色，如图1
          }
        },
        boundaryGap: true, // x轴不从0点开始
        axisLine: {
          onZero: true,
          lineStyle: {
            color: param.colorOption === undefined ? '#800000' : param.colorOption.xLineColor,
            width: 1,
            type: 'solid'
          }
        },
        data: param.xdata
      }],
      yAxis: param.yAxis === undefined ? [{
        type: 'value',
        min: param.yMin ? param.yMin : 0,
        axisLabel: {
          textStyle: {
            color: param.colorOption === undefined ? '#800000' : param.colorOption.yTxtColor,
            fontSize: '12',
            extraCssText: 'line-height:30px'
          }
        },
        axisLine: { // 坐标轴样式
          onZero: true,
          lineStyle: {
            color: param.colorOption === undefined ? '#800000' : param.colorOption.yLineColor,
            width: 1,
            type: 'solid'
          }
        },
        // axisTick: { // 刻度
        //   show: false
        // },
        splitLine: { // 置表格中分割线线条  这个是x跟y轴轴的线
          show: false,
          lineStyle: {
            color: param.colorOption === undefined ? '#800000' : param.colorOption.backgroundLineColor,
            type: 'solid'
          }
        }
      }] : param.yAxis,
      series: tempArry, // param.serrydata
      dataZoom: [{ // 区域缩放
        type: 'inside',
        show: true,
        xAxisIndex: [0],
        start: 1,
        end: 100,
        startValue: 1,
        endValue: 2000
      }]
    };

    // LineChart.setOption(option);
    window[this.props.id].setOption(option);
  }

  render() {
    const { id } = this.props;
    return (
      <div id={id} style={{ width: '98%', height: '100%' }} />
    );
  }
}

// PageComponent.propTypes = {
  // param: PropTypes.object().isRequired
// };
export default PageComponent;

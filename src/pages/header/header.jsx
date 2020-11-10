import React, { Component } from 'react';
import './header.less';
import axios from 'axios';
import lg01 from 'images/lg01.png';

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: null
    };
    this.getWeatherInfo = this.getWeatherInfo.bind(this);
  }

  getWeatherInfo(city) {
    const that = this;
    axios // 填自己的KEY
      .get(`https://free-api.heweather.net/s6/weather/now?location=${city}&key=7b24a89f23254ae2afce69a2e00e529a`)
      .then((resolve) => {
        const { data } = resolve;
        console.log(data);

        if (that.timer1) {
          clearTimeout(that.timer1);
        }
        that.timer1 = setTimeout(() => { that.getWeatherInfo(window.city); }, 60 * 60 * 1000);
        that.setState({ weatherData: data });
        // return data.status === 'ok' ? data : null
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {

    // this.getWeatherInfo(window.city);
  }

  componentWillUnmount() {
    if (this.timer1) {
      clearTimeout(this.timer1);
    }
  }

  render() {
    const { devname } = this.props;
    const { weatherData } = this.state;
    return (
      <div className="headWrap">
        <div className="hTop">

          <div className="middTit"><img src={lg01} />{devname}</div>

          {/* <div className="weather"> */}
          {/* <span>{weatherData!== null ? weatherData.HeWeather6[0].now.tmp: ''}℃</span> */}
          {/* <span className="spCondTxt">{weatherData!== null ?weatherData.HeWeather6[0].now.cond_txt: ''}</span> */}
          {/* <span> */}
          {/* <img src={weatherData!== null ?`https://cdn.heweather.com/img/plugin/190516/icon/c/${weatherData.HeWeather6[0].now.cond_code}d.png`:''} alt="" style={{width:'55px'}} /> */}
          {/* </span> */}
          {/* </div> */}
        </div>

      </div>

    );
  }
}

export default PageComponent;

import React from 'react';
import './App.css';

class Post extends React.Component {
  state = {
    cityName: '',
    helperText: '',
    currentState: 'begin',
    low: 0,
    high: 0,
    current: 0,
    imageUrl: '',
    weatherState: ''
  }

  handleChange = (event) => {
    this.setState({ cityName: event.target.value });
  }

  handleSubmit = async (event) => {
   event.preventDefault();

    if (!isNaN(this.state.cityName)) {
      this.setState({ currentState: '', helperText: 'Cityname can not contain numberic characters' });
    return;

    }

    this.setState({ currentState: 'loading', helperText: '' });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.state.cityName},au&units=metric&appid=30691f1349070120836f0a3cf1158589`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      // Get the icon
      let iconCode;

      let weather = json.weather[0];

      // There's a lot more variations based on time of day/severity, but I haven't had enough coffee to deal with that.
      if (typeof weather === 'undefined') {
        weather = null;
      } else {
        if (weather.id <= 232) {
          iconCode = "11d";
        }
        else if (weather.id <= 321 && weather.id > 232) {
          iconCode = '09d';
        } else if (weather.id <= 531 && weather.id > 321) {
          iconCode = '10d';
        } else if (weather.id <= 622 && weather.id > 531) {
          iconCode = '13d';
        } else if (weather.id <= 781 && weather.id > 622) {
          iconCode = '50d';
        } else if (weather.id === 800) {
          iconCode = '01d';
        } else if (weather.id > 800) {
          iconCode = '02d';
        }
      }

      this.setState({
        currentState: 'results',
        low: json.main.temp_min,
        high: json.main.temp_max,
        current: json.main.temp,
        imageUrl: (iconCode) ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : "",
        weatherState: weather?.description
      });
    }
    catch (ex) {
      this.setState({ currentState: 'error', helperText: 'Something went wrong while making request!' });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Australian Weather App</h1>
        {
          (this.state.currentState === 'loading') &&
          (
            <p>Fetching data...</p>
          )
        }
        {
          (this.state.currentState === 'results') &&
          (
            <>
              {(this.state.imageUrl !== '') &&
                (
                  <div className="image-container">
                    <img width={100} height={100} src={this.state.imageUrl} alt={this.state.weatherState} />
                  </div>
                )
              }

              <h4 className="cityname">{this.state.cityName}</h4>
              <h5 className="weather-state">{this.state.weatherState}</h5>

              <h1>{this.state.current}&#176;C</h1>

              <h3>Min: {this.state.low}&#176;C</h3>
              <h3>Max: {this.state.high}&#176;C</h3>
            </>
          )
        }
        {
          (this.state.currentState !== 'loading') &&
          (
            <form className="cityName-input" onSubmit={this.handleSubmit}>
              <label for="cityName-text" className="cityName-text-label">
                Enter your cityname to retrieve  the weather:
              </label>

              <div>
                <input id="Name" placeholder={"i.e Melbourne, Sydney etc"} onChange={this.handleChange} />

                <input type="submit" value="Get Weather!" />
                {
                  (this.state.helperText.length > 0) &&
                  (
                    <p>
                      {this.state.helperText}
                    </p>
                  )
                }
              </div>
            </form>)
        }
      </div>
    )
  }
}

export default Post;

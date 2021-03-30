import React from 'react';
import heavyrainandthunder from './heavyrainandthunder.svg';
import lightrain from './lightrain.svg';
import heavysnowshowersandthunder_polartwilight from './heavysnowshowersandthunder_polartwilight.svg';
import heavyrainshowers_polartwilight from './heavyrainshowers_polartwilight.svg';
import lightrainshowers_night from './lightrainshowers_night.svg';
import lightrainshowersandthunder_polartwilight from './lightrainshowersandthunder_polartwilight.svg';
import fair_day from './fair_day.svg';
import lightsnowshowers_night from './lightsnowshowers_night.svg';
import snow from './snow.svg';
import heavysleetshowersandthunder_night from './heavysleetshowersandthunder_night.svg';
import lightsnowandthunder from './lightsnowandthunder.svg';
import snowshowersandthunder_day from './snowshowersandthunder_day.svg';
import sleetshowers_day from './sleetshowers_day.svg';
import heavyrainshowersandthunder_night from './heavyrainshowersandthunder_night.svg';
import rainandthunder from './rainandthunder.svg';
import lightssnowshowersandthunder_day from './lightssnowshowersandthunder_day.svg';
import WeatherIcons from './WeatherIcons.jsx';
import sleetshowersandthunder_night from './sleetshowersandthunder_night.svg';
import rainshowersandthunder_night from './rainshowersandthunder_night.svg';
import heavysleetandthunder from './heavysleetandthunder.svg';
import sleetandthunder from './sleetandthunder.svg';
import heavysleet from './heavysleet.svg';
import lightsnowshowers_polartwilight from './lightsnowshowers_polartwilight.svg';
import rainshowersandthunder_day from './rainshowersandthunder_day.svg';
import lightrainshowersandthunder_night from './lightrainshowersandthunder_night.svg';
import snowshowers_night from './snowshowers_night.svg';
import heavysnowshowers_night from './heavysnowshowers_night.svg';
import lightsleet from './lightsleet.svg';
import fair_night from './fair_night.svg';
import heavysleetshowersandthunder_polartwilight from './heavysleetshowersandthunder_polartwilight.svg';
import heavyrainshowers_night from './heavyrainshowers_night.svg';
import sleetshowersandthunder_day from './sleetshowersandthunder_day.svg';
import rainshowers_day from './rainshowers_day.svg';
import heavyrainshowers_day from './heavyrainshowers_day.svg';
import lightssleetshowersandthunder_day from './lightssleetshowersandthunder_day.svg';
import rainshowers_night from './rainshowers_night.svg';
import clearsky_night from './clearsky_night.svg';
import lightrainshowers_polartwilight from './lightrainshowers_polartwilight.svg';
import fog from './fog.svg';
import heavysnow from './heavysnow.svg';
import heavysnowshowers_polartwilight from './heavysnowshowers_polartwilight.svg';
import heavysleetshowers_polartwilight from './heavysleetshowers_polartwilight.svg';
import heavyrainshowersandthunder_polartwilight from './heavyrainshowersandthunder_polartwilight.svg';
import lightsnowshowers_day from './lightsnowshowers_day.svg';
import sleet from './sleet.svg';
import fair_polartwilight from './fair_polartwilight.svg';
import partlycloudy_day from './partlycloudy_day.svg';
import snowshowersandthunder_polartwilight from './snowshowersandthunder_polartwilight.svg';
import rain from './rain.svg';
import clearsky_day from './clearsky_day.svg';
import partlycloudy_night from './partlycloudy_night.svg';
import snowshowers_polartwilight from './snowshowers_polartwilight.svg';
import lightsleetshowers_day from './lightsleetshowers_day.svg';
import lightsnow from './lightsnow.svg';
import heavysnowshowers_day from './heavysnowshowers_day.svg';
import snowshowers_day from './snowshowers_day.svg';
import lightrainshowers_day from './lightrainshowers_day.svg';
import snowshowersandthunder_night from './snowshowersandthunder_night.svg';
import heavysnowshowersandthunder_night from './heavysnowshowersandthunder_night.svg';
import heavyrainshowersandthunder_day from './heavyrainshowersandthunder_day.svg';
import lightssleetshowersandthunder_night from './lightssleetshowersandthunder_night.svg';
import sleetshowersandthunder_polartwilight from './sleetshowersandthunder_polartwilight.svg';
import lightsleetandthunder from './lightsleetandthunder.svg';
import heavysnowandthunder from './heavysnowandthunder.svg';
import lightsleetshowers_polartwilight from './lightsleetshowers_polartwilight.svg';
import clearsky_polartwilight from './clearsky_polartwilight.svg';
import lightssnowshowersandthunder_night from './lightssnowshowersandthunder_night.svg';
import partlycloudy_polartwilight from './partlycloudy_polartwilight.svg';
import lightssleetshowersandthunder_polartwilight from './lightssleetshowersandthunder_polartwilight.svg';
import heavysnowshowersandthunder_day from './heavysnowshowersandthunder_day.svg';
import heavysleetshowersandthunder_day from './heavysleetshowersandthunder_day.svg';
import snowandthunder from './snowandthunder.svg';
import cloudy from './cloudy.svg';
import lightssnowshowersandthunder_polartwilight from './lightssnowshowersandthunder_polartwilight.svg';
import rainshowersandthunder_polartwilight from './rainshowersandthunder_polartwilight.svg';
import heavysleetshowers_day from './heavysleetshowers_day.svg';
import sleetshowers_polartwilight from './sleetshowers_polartwilight.svg';
import heavysleetshowers_night from './heavysleetshowers_night.svg';
import lightrainandthunder from './lightrainandthunder.svg';
import lightrainshowersandthunder_day from './lightrainshowersandthunder_day.svg';
import rainshowers_polartwilight from './rainshowers_polartwilight.svg';
import sleetshowers_night from './sleetshowers_night.svg';
import lightsleetshowers_night from './lightsleetshowers_night.svg';
import heavyrain from './heavyrain.svg';

export default function getIcon(name, isDay, className) {
    const suffix = isDay ? "_day" : "_night";
    if (name === 'heavyrainandthunder' || (name + suffix) === 'heavyrainandthunder') {
        return (<img className={className} src={heavyrainandthunder} alt="heavyrainandthunder"  />);
    }
    if (name === 'lightrain' || (name + suffix) === 'lightrain') {
        return (<img className={className} src={lightrain} alt="lightrain"  />);
    }
    if (name === 'heavysnowshowersandthunder_polartwilight' || (name + suffix) === 'heavysnowshowersandthunder_polartwilight') {
        return (<img className={className} src={heavysnowshowersandthunder_polartwilight} alt="heavysnowshowersandthunder_polartwilight"  />);
    }
    if (name === 'heavyrainshowers_polartwilight' || (name + suffix) === 'heavyrainshowers_polartwilight') {
        return (<img className={className} src={heavyrainshowers_polartwilight} alt="heavyrainshowers_polartwilight"  />);
    }
    if (name === 'lightrainshowers_night' || (name + suffix) === 'lightrainshowers_night') {
        return (<img className={className} src={lightrainshowers_night} alt="lightrainshowers_night"  />);
    }
    if (name === 'lightrainshowersandthunder_polartwilight' || (name + suffix) === 'lightrainshowersandthunder_polartwilight') {
        return (<img className={className} src={lightrainshowersandthunder_polartwilight} alt="lightrainshowersandthunder_polartwilight"  />);
    }
    if (name === 'fair_day' || (name + suffix) === 'fair_day') {
        return (<img className={className} src={fair_day} alt="fair_day"  />);
    }
    if (name === 'lightsnowshowers_night' || (name + suffix) === 'lightsnowshowers_night') {
        return (<img className={className} src={lightsnowshowers_night} alt="lightsnowshowers_night"  />);
    }
    if (name === 'snow' || (name + suffix) === 'snow') {
        return (<img className={className} src={snow} alt="snow"  />);
    }
    if (name === 'heavysleetshowersandthunder_night' || (name + suffix) === 'heavysleetshowersandthunder_night') {
        return (<img className={className} src={heavysleetshowersandthunder_night} alt="heavysleetshowersandthunder_night"  />);
    }
    if (name === 'lightsnowandthunder' || (name + suffix) === 'lightsnowandthunder') {
        return (<img className={className} src={lightsnowandthunder} alt="lightsnowandthunder"  />);
    }
    if (name === 'snowshowersandthunder_day' || (name + suffix) === 'snowshowersandthunder_day') {
        return (<img className={className} src={snowshowersandthunder_day} alt="snowshowersandthunder_day"  />);
    }
    if (name === 'sleetshowers_day' || (name + suffix) === 'sleetshowers_day') {
        return (<img className={className} src={sleetshowers_day} alt="sleetshowers_day"  />);
    }
    if (name === 'heavyrainshowersandthunder_night' || (name + suffix) === 'heavyrainshowersandthunder_night') {
        return (<img className={className} src={heavyrainshowersandthunder_night} alt="heavyrainshowersandthunder_night"  />);
    }
    if (name === 'rainandthunder' || (name + suffix) === 'rainandthunder') {
        return (<img className={className} src={rainandthunder} alt="rainandthunder"  />);
    }
    if (name === 'lightssnowshowersandthunder_day' || (name + suffix) === 'lightssnowshowersandthunder_day') {
        return (<img className={className} src={lightssnowshowersandthunder_day} alt="lightssnowshowersandthunder_day"  />);
    }
    if (name === 'WeatherIcons' || (name + suffix) === 'WeatherIcons') {
        return (<img className={className} src={WeatherIcons} alt="WeatherIcons"  />);
    }
    if (name === 'sleetshowersandthunder_night' || (name + suffix) === 'sleetshowersandthunder_night') {
        return (<img className={className} src={sleetshowersandthunder_night} alt="sleetshowersandthunder_night"  />);
    }
    if (name === 'rainshowersandthunder_night' || (name + suffix) === 'rainshowersandthunder_night') {
        return (<img className={className} src={rainshowersandthunder_night} alt="rainshowersandthunder_night"  />);
    }
    if (name === 'heavysleetandthunder' || (name + suffix) === 'heavysleetandthunder') {
        return (<img className={className} src={heavysleetandthunder} alt="heavysleetandthunder"  />);
    }
    if (name === 'sleetandthunder' || (name + suffix) === 'sleetandthunder') {
        return (<img className={className} src={sleetandthunder} alt="sleetandthunder"  />);
    }
    if (name === 'heavysleet' || (name + suffix) === 'heavysleet') {
        return (<img className={className} src={heavysleet} alt="heavysleet"  />);
    }
    if (name === 'lightsnowshowers_polartwilight' || (name + suffix) === 'lightsnowshowers_polartwilight') {
        return (<img className={className} src={lightsnowshowers_polartwilight} alt="lightsnowshowers_polartwilight"  />);
    }
    if (name === 'rainshowersandthunder_day' || (name + suffix) === 'rainshowersandthunder_day') {
        return (<img className={className} src={rainshowersandthunder_day} alt="rainshowersandthunder_day"  />);
    }
    if (name === 'lightrainshowersandthunder_night' || (name + suffix) === 'lightrainshowersandthunder_night') {
        return (<img className={className} src={lightrainshowersandthunder_night} alt="lightrainshowersandthunder_night"  />);
    }
    if (name === 'snowshowers_night' || (name + suffix) === 'snowshowers_night') {
        return (<img className={className} src={snowshowers_night} alt="snowshowers_night"  />);
    }
    if (name === 'heavysnowshowers_night' || (name + suffix) === 'heavysnowshowers_night') {
        return (<img className={className} src={heavysnowshowers_night} alt="heavysnowshowers_night"  />);
    }
    if (name === 'lightsleet' || (name + suffix) === 'lightsleet') {
        return (<img className={className} src={lightsleet} alt="lightsleet"  />);
    }
    if (name === 'fair_night' || (name + suffix) === 'fair_night') {
        return (<img className={className} src={fair_night} alt="fair_night"  />);
    }
    if (name === 'heavysleetshowersandthunder_polartwilight' || (name + suffix) === 'heavysleetshowersandthunder_polartwilight') {
        return (<img className={className} src={heavysleetshowersandthunder_polartwilight} alt="heavysleetshowersandthunder_polartwilight"  />);
    }
    if (name === 'heavyrainshowers_night' || (name + suffix) === 'heavyrainshowers_night') {
        return (<img className={className} src={heavyrainshowers_night} alt="heavyrainshowers_night"  />);
    }
    if (name === 'sleetshowersandthunder_day' || (name + suffix) === 'sleetshowersandthunder_day') {
        return (<img className={className} src={sleetshowersandthunder_day} alt="sleetshowersandthunder_day"  />);
    }
    if (name === 'rainshowers_day' || (name + suffix) === 'rainshowers_day') {
        return (<img className={className} src={rainshowers_day} alt="rainshowers_day"  />);
    }
    if (name === 'heavyrainshowers_day' || (name + suffix) === 'heavyrainshowers_day') {
        return (<img className={className} src={heavyrainshowers_day} alt="heavyrainshowers_day"  />);
    }
    if (name === 'lightssleetshowersandthunder_day' || (name + suffix) === 'lightssleetshowersandthunder_day') {
        return (<img className={className} src={lightssleetshowersandthunder_day} alt="lightssleetshowersandthunder_day"  />);
    }
    if (name === 'rainshowers_night' || (name + suffix) === 'rainshowers_night') {
        return (<img className={className} src={rainshowers_night} alt="rainshowers_night"  />);
    }
    if (name === 'clearsky_night' || (name + suffix) === 'clearsky_night') {
        return (<img className={className} src={clearsky_night} alt="clearsky_night"  />);
    }
    if (name === 'lightrainshowers_polartwilight' || (name + suffix) === 'lightrainshowers_polartwilight') {
        return (<img className={className} src={lightrainshowers_polartwilight} alt="lightrainshowers_polartwilight"  />);
    }
    if (name === 'fog' || (name + suffix) === 'fog') {
        return (<img className={className} src={fog} alt="fog"  />);
    }
    if (name === 'heavysnow' || (name + suffix) === 'heavysnow') {
        return (<img className={className} src={heavysnow} alt="heavysnow"  />);
    }
    if (name === 'heavysnowshowers_polartwilight' || (name + suffix) === 'heavysnowshowers_polartwilight') {
        return (<img className={className} src={heavysnowshowers_polartwilight} alt="heavysnowshowers_polartwilight"  />);
    }
    if (name === 'heavysleetshowers_polartwilight' || (name + suffix) === 'heavysleetshowers_polartwilight') {
        return (<img className={className} src={heavysleetshowers_polartwilight} alt="heavysleetshowers_polartwilight"  />);
    }
    if (name === 'heavyrainshowersandthunder_polartwilight' || (name + suffix) === 'heavyrainshowersandthunder_polartwilight') {
        return (<img className={className} src={heavyrainshowersandthunder_polartwilight} alt="heavyrainshowersandthunder_polartwilight"  />);
    }
    if (name === 'lightsnowshowers_day' || (name + suffix) === 'lightsnowshowers_day') {
        return (<img className={className} src={lightsnowshowers_day} alt="lightsnowshowers_day"  />);
    }
    if (name === 'sleet' || (name + suffix) === 'sleet') {
        return (<img className={className} src={sleet} alt="sleet"  />);
    }
    if (name === 'fair_polartwilight' || (name + suffix) === 'fair_polartwilight') {
        return (<img className={className} src={fair_polartwilight} alt="fair_polartwilight"  />);
    }
    if (name === 'partlycloudy_day' || (name + suffix) === 'partlycloudy_day') {
        return (<img className={className} src={partlycloudy_day} alt="partlycloudy_day"  />);
    }
    if (name === 'snowshowersandthunder_polartwilight' || (name + suffix) === 'snowshowersandthunder_polartwilight') {
        return (<img className={className} src={snowshowersandthunder_polartwilight} alt="snowshowersandthunder_polartwilight"  />);
    }
    if (name === 'rain' || (name + suffix) === 'rain') {
        return (<img className={className} src={rain} alt="rain"  />);
    }
    if (name === 'clearsky_day' || (name + suffix) === 'clearsky_day') {
        return (<img className={className} src={clearsky_day} alt="clearsky_day"  />);
    }
    if (name === 'partlycloudy_night' || (name + suffix) === 'partlycloudy_night') {
        return (<img className={className} src={partlycloudy_night} alt="partlycloudy_night"  />);
    }
    if (name === 'snowshowers_polartwilight' || (name + suffix) === 'snowshowers_polartwilight') {
        return (<img className={className} src={snowshowers_polartwilight} alt="snowshowers_polartwilight"  />);
    }
    if (name === 'lightsleetshowers_day' || (name + suffix) === 'lightsleetshowers_day') {
        return (<img className={className} src={lightsleetshowers_day} alt="lightsleetshowers_day"  />);
    }
    if (name === 'lightsnow' || (name + suffix) === 'lightsnow') {
        return (<img className={className} src={lightsnow} alt="lightsnow"  />);
    }
    if (name === 'heavysnowshowers_day' || (name + suffix) === 'heavysnowshowers_day') {
        return (<img className={className} src={heavysnowshowers_day} alt="heavysnowshowers_day"  />);
    }
    if (name === 'snowshowers_day' || (name + suffix) === 'snowshowers_day') {
        return (<img className={className} src={snowshowers_day} alt="snowshowers_day"  />);
    }
    if (name === 'lightrainshowers_day' || (name + suffix) === 'lightrainshowers_day') {
        return (<img className={className} src={lightrainshowers_day} alt="lightrainshowers_day"  />);
    }
    if (name === 'snowshowersandthunder_night' || (name + suffix) === 'snowshowersandthunder_night') {
        return (<img className={className} src={snowshowersandthunder_night} alt="snowshowersandthunder_night"  />);
    }
    if (name === 'heavysnowshowersandthunder_night' || (name + suffix) === 'heavysnowshowersandthunder_night') {
        return (<img className={className} src={heavysnowshowersandthunder_night} alt="heavysnowshowersandthunder_night"  />);
    }
    if (name === 'heavyrainshowersandthunder_day' || (name + suffix) === 'heavyrainshowersandthunder_day') {
        return (<img className={className} src={heavyrainshowersandthunder_day} alt="heavyrainshowersandthunder_day"  />);
    }
    if (name === 'lightssleetshowersandthunder_night' || (name + suffix) === 'lightssleetshowersandthunder_night') {
        return (<img className={className} src={lightssleetshowersandthunder_night} alt="lightssleetshowersandthunder_night"  />);
    }
    if (name === 'sleetshowersandthunder_polartwilight' || (name + suffix) === 'sleetshowersandthunder_polartwilight') {
        return (<img className={className} src={sleetshowersandthunder_polartwilight} alt="sleetshowersandthunder_polartwilight"  />);
    }
    if (name === 'lightsleetandthunder' || (name + suffix) === 'lightsleetandthunder') {
        return (<img className={className} src={lightsleetandthunder} alt="lightsleetandthunder"  />);
    }
    if (name === 'heavysnowandthunder' || (name + suffix) === 'heavysnowandthunder') {
        return (<img className={className} src={heavysnowandthunder} alt="heavysnowandthunder"  />);
    }
    if (name === 'lightsleetshowers_polartwilight' || (name + suffix) === 'lightsleetshowers_polartwilight') {
        return (<img className={className} src={lightsleetshowers_polartwilight} alt="lightsleetshowers_polartwilight"  />);
    }
    if (name === 'clearsky_polartwilight' || (name + suffix) === 'clearsky_polartwilight') {
        return (<img className={className} src={clearsky_polartwilight} alt="clearsky_polartwilight"  />);
    }
    if (name === 'lightssnowshowersandthunder_night' || (name + suffix) === 'lightssnowshowersandthunder_night') {
        return (<img className={className} src={lightssnowshowersandthunder_night} alt="lightssnowshowersandthunder_night"  />);
    }
    if (name === 'partlycloudy_polartwilight' || (name + suffix) === 'partlycloudy_polartwilight') {
        return (<img className={className} src={partlycloudy_polartwilight} alt="partlycloudy_polartwilight"  />);
    }
    if (name === 'lightssleetshowersandthunder_polartwilight' || (name + suffix) === 'lightssleetshowersandthunder_polartwilight') {
        return (<img className={className} src={lightssleetshowersandthunder_polartwilight} alt="lightssleetshowersandthunder_polartwilight"  />);
    }
    if (name === 'heavysnowshowersandthunder_day' || (name + suffix) === 'heavysnowshowersandthunder_day') {
        return (<img className={className} src={heavysnowshowersandthunder_day} alt="heavysnowshowersandthunder_day"  />);
    }
    if (name === 'heavysleetshowersandthunder_day' || (name + suffix) === 'heavysleetshowersandthunder_day') {
        return (<img className={className} src={heavysleetshowersandthunder_day} alt="heavysleetshowersandthunder_day"  />);
    }
    if (name === 'snowandthunder' || (name + suffix) === 'snowandthunder') {
        return (<img className={className} src={snowandthunder} alt="snowandthunder"  />);
    }
    if (name === 'cloudy' || (name + suffix) === 'cloudy') {
        return (<img className={className} src={cloudy} alt="cloudy"  />);
    }
    if (name === 'lightssnowshowersandthunder_polartwilight' || (name + suffix) === 'lightssnowshowersandthunder_polartwilight') {
        return (<img className={className} src={lightssnowshowersandthunder_polartwilight} alt="lightssnowshowersandthunder_polartwilight"  />);
    }
    if (name === 'rainshowersandthunder_polartwilight' || (name + suffix) === 'rainshowersandthunder_polartwilight') {
        return (<img className={className} src={rainshowersandthunder_polartwilight} alt="rainshowersandthunder_polartwilight"  />);
    }
    if (name === 'heavysleetshowers_day' || (name + suffix) === 'heavysleetshowers_day') {
        return (<img className={className} src={heavysleetshowers_day} alt="heavysleetshowers_day"  />);
    }
    if (name === 'sleetshowers_polartwilight' || (name + suffix) === 'sleetshowers_polartwilight') {
        return (<img className={className} src={sleetshowers_polartwilight} alt="sleetshowers_polartwilight"  />);
    }
    if (name === 'heavysleetshowers_night' || (name + suffix) === 'heavysleetshowers_night') {
        return (<img className={className} src={heavysleetshowers_night} alt="heavysleetshowers_night"  />);
    }
    if (name === 'lightrainandthunder' || (name + suffix) === 'lightrainandthunder') {
        return (<img className={className} src={lightrainandthunder} alt="lightrainandthunder"  />);
    }
    if (name === 'lightrainshowersandthunder_day' || (name + suffix) === 'lightrainshowersandthunder_day') {
        return (<img className={className} src={lightrainshowersandthunder_day} alt="lightrainshowersandthunder_day"  />);
    }
    if (name === 'rainshowers_polartwilight' || (name + suffix) === 'rainshowers_polartwilight') {
        return (<img className={className} src={rainshowers_polartwilight} alt="rainshowers_polartwilight"  />);
    }
    if (name === 'sleetshowers_night' || (name + suffix) === 'sleetshowers_night') {
        return (<img className={className} src={sleetshowers_night} alt="sleetshowers_night"  />);
    }
    if (name === 'lightsleetshowers_night' || (name + suffix) === 'lightsleetshowers_night') {
        return (<img className={className} src={lightsleetshowers_night} alt="lightsleetshowers_night"  />);
    }
    if (name === 'heavyrain' || (name + suffix) === 'heavyrain') {
        return (<img className={className} src={heavyrain} alt="heavyrain"  />);
    }
    return null;
};

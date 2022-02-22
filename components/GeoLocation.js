import React, { useState } from 'react';

const Geo = (props) => {
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          props.latData(position.coords.latitude);
          props.longData(position.coords.longitude);
        },
        () => {
          setStatus('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <div className="btn-red">
      <button onClick={getLocation}>Get Location</button>
      {/* <h1>Coordinates</h1>
      <p>{status}</p>
      {lat && <p>Latitude: {lat}</p>}
      {lng && <p>Longitude: {lng}</p>} */}
    </div>
  );
};

export default Geo;

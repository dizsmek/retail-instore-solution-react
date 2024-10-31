import { useEffect, useMemo, useState } from 'react';
import loadingIcon from '../../assets/icons/spinner.svg';
import './TimeDisplay.scss';

function TimeDisplay({ selectedCity }) {
  const [timeData, setTimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const CITY_TO_IANA_NAME = useMemo(() => ({
    cupertino: 'America/Los_Angeles',
    'new-york-city': 'America/New_York',
    london: 'Europe/London',
    amsterdam: 'Europe/Brussels',
    tokyo: 'Asia/Tokyo',
    'hong-kong': 'Asia/Hong_Kong',
    sydney: 'Australia/Sydney'
  }), []);

  const textToDisplay = () => {
    if (timeData) {
      const jsDateTime = new Date(timeData.dateTime);
      const timeToDisplay = jsDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      const dateToDisplay = jsDateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});

      return (
        <div>
          <h1 class='time-display-text'>It is currently {timeToDisplay} in {selectedCity.label}</h1>
          <p>{dateToDisplay}</p>
        </div>
      );
    } else if (isLoading) {
      return (
        <>
          <img src={loadingIcon} className='spinner' alt='' />
          <h1>Loading...</h1>
        </>
      );
    } else {
      return <h1>Failed to get time data.</h1>;
    }
  }

  useEffect(() => {
    setIsLoading(true);
  }, [selectedCity]);

  useEffect(() => {
    const fetchTimeData = async () => {
      const ianaCitName = CITY_TO_IANA_NAME[selectedCity.section];
      const [continent, city] = ianaCitName.split('/');
  
      try {
        const res = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`);
  
        if (res.status !== 200) throw new Error(`Failed to get time data from ${ianaCitName}`);
  
        const data =  await res.json();
  
        setTimeData(data);
      } catch (error) {
        console.error(error.message);
      }
  
      setIsLoading(false);
    }

    if (setIsLoading) {
      setTimeData(null);
      fetchTimeData();
    }
  }, [setIsLoading, CITY_TO_IANA_NAME, selectedCity.section]);
  
  return (
    <div className='time-display-wrapper'>
      <div className='time-display'>
        {textToDisplay()}
      </div>
    </div>
  );
}
  
export default TimeDisplay;
  


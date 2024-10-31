import { useEffect, useMemo, useState } from 'react';
import loadingIcon from '../../assets/icons/spinner.svg';
import './TimeDisplay.scss';

function TimeDisplay({ selectedCity }) {
  const [timeData, setTimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * IANA city names are required to fetch the time at given locations.
   * The keys in this object match the `"section"` property values in `navigation.json`.
   */
  const CITY_TO_IANA_NAME = useMemo(() => ({
    cupertino: 'America/Los_Angeles',
    'new-york-city': 'America/New_York',
    london: 'Europe/London',
    amsterdam: 'Europe/Brussels',
    tokyo: 'Asia/Tokyo',
    'hong-kong': 'Asia/Hong_Kong',
    sydney: 'Australia/Sydney'
  }), []);

  /**
   * Since there are 3 different states we could display, it's more readable to move this logic
   * outside of the JSX in the components return statement.
   * 
   * The 3 states to handle are:
   * - Fetching data
   * - Showing fetched time data
   * - Failed to fetch time data
   */
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
  
      // Either we failed to fetch data or we successfully got it, we need to set `isLoading` to `false`.
      setIsLoading(false);
    }

    // We need to make the fetching a side effect of `isLoading`,
    // so that we prevent a race condition where the `timeData` is reset
    // before `isLoading` is set to `true`.
    if (isLoading) {
      setTimeData(null);
      fetchTimeData();
    }
  }, [isLoading, CITY_TO_IANA_NAME, selectedCity.section]);
  
  return (
    <div className='time-display-wrapper'>
      <div className='time-display'>
        {textToDisplay()}
      </div>
    </div>
  );
}
  
export default TimeDisplay;
  


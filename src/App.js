import { useState } from 'react';
import NavMenu from './components/NavMenu/NavMenu';
import TimeDisplay from './components/TimeDisplay/TimeDisplay';
import navigation from './assets/navigation.json';
import './App.scss';

function App() {
  const [selectedNavIdx, setSelectedNavIdx] = useState(0);

  const selectedCity = navigation.cities[selectedNavIdx];

  const handleSelectedNavItemChange = (newIdx) => {
    setSelectedNavIdx(newIdx);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <NavMenu navItems={navigation.cities} onSelectedNavItemChange={handleSelectedNavItemChange} selectedIdx={selectedNavIdx} />
      </header>
      <TimeDisplay selectedCity={selectedCity} />
    </div>
  );
}

export default App;

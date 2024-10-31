import { useEffect, useRef, useState } from 'react';
import './NavMenu.scss';

function NavMenu({ navItems, onSelectedNavItemChange, selectedIdx }) {
  const activeItemRef = useRef();

  const [indicatorLeftOffset, setIndicatorLeftOffset] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [enableIndicatorTransition, setEnableIndicatorTransition] = useState(false);

  const updateIndicatorPosition = () => {
    setIndicatorLeftOffset(activeItemRef.current.firstChild.offsetLeft);
    setIndicatorWidth(activeItemRef.current.firstChild.offsetWidth);
  }

  const handleTransitionEnd = () => {
    setEnableIndicatorTransition(false);
  }

  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition();
    }
    
    window.addEventListener('resize', handleResize);

    handleResize();
    
    return () => {
     window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  useEffect(() => {
    updateIndicatorPosition();
  }, [enableIndicatorTransition]);

  const handleNavItemClick = (event, idx) => {
    if (idx === selectedIdx) return;

    setEnableIndicatorTransition(true);
    onSelectedNavItemChange(idx);
  };

  return (
    <nav className='nav'>
      <ul className='nav-list'>
        {navItems.map((city, idx) => (
          <li
            className={`nav-list-item ${selectedIdx === idx ? 'active' : ''}`}
            onClick={(event) => handleNavItemClick(event, idx)}
            key={idx}
            ref={selectedIdx === idx ? activeItemRef : null}
          >
            <span tabIndex='0' role='link' className='link'>{city.label}</span>
          </li>
        ))}

        <span
          aria-hidden='true'
          className='nav-indicator'
          style={{
            left: `${indicatorLeftOffset}px`,
            width: `${indicatorWidth}px`,
            transition: enableIndicatorTransition ? 'all 200ms' : 'none'
          }}
          onTransitionEnd={handleTransitionEnd}
        />
      </ul>
    </nav>
  );
}
  
export default NavMenu;
  

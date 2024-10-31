import { useEffect, useRef, useState } from 'react';
import './NavMenu.scss';

function NavMenu({ navItems, onSelectedNavItemChange, selectedIdx }) {
  const activeItemRef = useRef();

  const [indicatorLeftOffset, setIndicatorLeftOffset] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [enableIndicatorTransition, setEnableIndicatorTransition] = useState(false);

  const updateIndicatorPosition = () => {
    // We're moving the indicator under the <span> inside the active nav item.
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

  // `updateIndicatorPosition()` runs as an effect of enableIndicatorTransition,
  // so that we prevent a race condition where we update the indicator position
  // before we enabled the CSS transition on it.
  useEffect(() => {
    if (enableIndicatorTransition) {
      updateIndicatorPosition();
    }
  }, [enableIndicatorTransition]);

  const handleNavItemClick = (idx) => {
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
            onClick={() => handleNavItemClick(idx)}
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
            // We need to add / remove transition so that the indicator
            // doesn't animate on page load or resize.
            transition: enableIndicatorTransition ? 'all 200ms' : 'none'
          }}
          onTransitionEnd={handleTransitionEnd}
        />
      </ul>
    </nav>
  );
}
  
export default NavMenu;
  

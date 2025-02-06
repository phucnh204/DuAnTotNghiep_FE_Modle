import React, { useEffect, useState, useRef } from 'react';
import 'tailwindcss/tailwind.css';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [underlineStyle, setUnderlineStyle] = useState({ width: '120px', left: '0px' });
  const tabRefs = useRef([]);

  const switchTab = (event, tabId, index) => {
    const tabElement = tabRefs.current[index];
    const tabWidth = tabElement.offsetWidth;
    const tabLeft = tabElement.offsetLeft;
    setUnderlineStyle({ width: `${tabWidth}px`, left: `${tabLeft}px` });
    setActiveTab(tabId);
  };

  useEffect(() => {
    const firstTab = tabRefs.current[0];
    if (firstTab) {
      setUnderlineStyle({ width: `${firstTab.offsetWidth}px`, left: `${firstTab.offsetLeft}px` });
    }
  }, []);

  return (
    <div style={{borderRadius:"7px"}} className="container mx-auto p-4 relative bg-white">
      {/* Tabs */}
      <p className="font-semibold">Kênh người bán > Quản lý sản phẩm > Thêm sản phẩm</p>
      <div className=" border-gray-200 relative">
        <nav className="flex space-x-8 relative" aria-label="Tabs">
          {/* Tab Items */}
          {['tab1', 'tab2'].map((tabId, index) => (
            <span
              key={tabId}
              href={`#${tabId}`}
              ref={(el) => (tabRefs.current[index] = el)}
              className={` text-base tab-item text-gray-${activeTab === tabId ? '900' : '500'} py-4 px-4 font-medium relative`}
              onClick={(e) => switchTab(e, tabId, index)}
            >
              {tabId === 'tab1' && 'Thông tin cơ bản'}
              {tabId === 'tab2' && 'Thông tin biến thể'}
            </span>
          ))}
        </nav>
        {/* Underline */}
        <div
          id="underline"
          className="underline"
          style={{
            position: 'absolute',
            bottom: 0,
            height: '2px',
            backgroundColor: '#f97316',
            transition: 'all 0.3s ease',
            ...underlineStyle,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TabNavigation;


import React, { useEffect, useState, useRef, useMemo } from 'react';
import 'tailwindcss/tailwind.css';
import api from '../../../config/APISeller';

const HoaDonTab = ({setTab}) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [underlineStyle, setUnderlineStyle] = useState({ width: '120px', left: '0px' });
  const [countOrder, setCountOrder] = useState(new Map());
  const tabRefs = useRef([]);

  const switchTab = (event, tabId, index) => {
    const tabElement = tabRefs.current[index];
    const tabWidth = tabElement.offsetWidth;
    const tabLeft = tabElement.offsetLeft;
    setTab(tabId)
    setUnderlineStyle({ width: `${tabWidth}px`, left: `${tabLeft}px` });
    setActiveTab(tabId);
  };

  useEffect(() => {
    const firstTab = tabRefs.current[0];
    if (firstTab) {
      setUnderlineStyle({ width: `${firstTab.offsetWidth}px`, left: `${firstTab.offsetLeft}px` });
    }
    
    api.get("/order/getcountorderbystatus").then(v => v.data).then(v => {
      setCountOrder(v.data);
    });

  }, []);

  const tabs = useMemo(() => [
    { id: 1, tabName: "Chờ thanh toán" },
    { id: 2, tabName: "Chuẩn bị hàng" },
    { id: 3, tabName: "Chờ giao hàng" },
    { id: 4, tabName: "Đang giao hàng" },
    { id: 5, tabName: "Giao thành công" },
    { id: 6, tabName: "Giao thất bại" },
    { id: 7, tabName: "Đơn hủy" },
  ], []);

  return (
    <div  className="container mx-auto p-4 relative bg-white rounded-[7px]">
      <div className="border-gray-200 relative overflow-auto " >
        <nav className="flex space-x-8 relative" aria-label="Tabs">
          {tabs.map((tabId, index) => (
            <span 
              key={tabId.id}
              ref={(el) => (tabRefs.current[index] = el)}
              className={`text-base tab-item text-gray-${activeTab === tabId.id ? '900' : '500'} cursor-pointer py-4 px-4 font-medium relative`}
              onClick={(e) => switchTab(e, tabId.id, index)}
            >
              <span className="text-sm">
                {tabId.tabName} ({countOrder[tabId.id] !== undefined ? `${countOrder[tabId.id]}` : 0})
              </span>
            </span>
          ))}
        </nav>
        <div
          id="underline"
          className="underline absolute bottom-0 h-[2px] bg-[#f97316] transition-all ease-in-out duration-300"
          style={underlineStyle} 
        ></div>
      </div>
    </div>
  );
};

export default React.memo(HoaDonTab);

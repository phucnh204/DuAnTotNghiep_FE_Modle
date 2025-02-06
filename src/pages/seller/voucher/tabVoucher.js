import React, { useEffect, useState, useRef } from 'react';
import 'tailwindcss/tailwind.css';

const TabVoucher = ({setTypeFetch}) => {
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
        <div style={{overflow:"auto"}}>
            {/* Tabs */}
            <div className=" border-gray-200 relative">
                <nav className="flex space-x-8 relative" aria-label="Tabs">
                    {[0, 1,2,3].map((tabId, index) => (
                        <span 
                            key={tabId}
                            style={{cursor:"pointer"}}
                            ref={(el) => (tabRefs.current[index] = el)}
                            className={` text-base tab-item text-gray-${
                                activeTab === tabId ? '900' : '500'
                            } py-4 px-4 font-medium relative`}
                            onClick={(e) => {
                                setTypeFetch(index)
                                switchTab(e, tabId, index)
                            }}
                        >
                            {tabId ===0 && 'Tất cả'}
                            {tabId ===1 && 'Chưa diễn ra'}
                            {tabId ===2 && 'Đang diễn ra'}
                            {tabId ===3 && 'Đã kết thúc'}
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

export default TabVoucher;

import { useEffect, useState, useRef, memo, useCallback } from 'react';
import 'tailwindcss/tailwind.css';

const TabProduct = ({ setTab }) => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [underlineStyle, setUnderlineStyle] = useState({ width: '120px', left: '0px' });
    const tabRefs = useRef([]);

    const switchTab = useCallback(
        (event, tabId, index) => {
            setTab(tabId);
            const tabElement = tabRefs.current[index];
            const tabWidth = tabElement.offsetWidth;
            const tabLeft = tabElement.offsetLeft;
            setUnderlineStyle({ width: `${tabWidth}px`, left: `${tabLeft}px` });
            setActiveTab(tabId);
        },
        [setTab],
    );

    useEffect(() => {
        const firstTab = tabRefs.current[0];
        if (firstTab) {
            setUnderlineStyle({ width: `${firstTab.offsetWidth}px`, left: `${firstTab.offsetLeft}px` });
        }
    }, []);

    return (
        <div  className="rounded-[7px] container mx-auto p-4 relative bg-white">
            {/* Tabs */}
            <p className="font-semibold text-sm sm:text-base">Kênh người bán &gt; Quản lý sản phẩm &gt; Xem sản phẩm</p>
            <div className="border-gray-200 relative">
                <nav className="flex space-x-8 relative" aria-label="Tabs">
                    {['1', '0', '2'].map((tabId, index) => (
                        <span
                            key={tabId}
                            ref={(el) => (tabRefs.current[index] = el)}
                            className={`text-base tab-item text-gray-${activeTab === tabId ? '900' : '500'} py-4 px-4 font-medium relative`}
                            onClick={(e) => switchTab(e, tabId, index)}
                        >
                            {tabId === '1' && 'Đang hoạt động'}
                            {tabId === '0' && 'Ngừng hoạt động'}
                            {tabId === '2' && 'Tạm khóa (Quản trị)'}
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

export default memo(TabProduct);

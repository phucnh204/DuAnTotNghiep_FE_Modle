import {useRef } from 'react';
import ProductTable from './productTable';
const ViewProduct = () => {
    const componentRef = useRef(null);
    return (
        <>
            <div ref={componentRef} className="scroll-smooth" >
                <ProductTable />
            </div>
        </>
    );
};
export default ViewProduct;

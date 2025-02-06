import React, { useEffect, useState } from 'react';

const CategorySearch = ({setChon}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories,setC]=useState([])
    const [flag,setFlag]=useState(1)
    const [cChooose,setCChoose]=useState([])
    const addSub=(sub,id)=>{
        setCChoose((prevItems) => [...prevItems.splice(0,id+1), sub]);
    }
    useEffect(() => {
        fetch('http://localhost:8080/category/getall')
            .then((v) => v.json())
            .then((v) => {
                categories.push(v.data)
                setFlag(flag+1)
            });
    }, []);
    const openModal = () => {
        setIsModalOpen(true);
        setTimeout(() => {
            document.getElementById('myModal').classList.remove('opacity-0');
            document.getElementById('modalPanel').classList.remove('scale-95');
        }, 10);
    };
    const closeModal = () => {
        document.getElementById('myModal').classList.add('opacity-0');
        document.getElementById('modalPanel').classList.add('scale-95');
        if(cChooose.length>0){
            setChon(cChooose[cChooose.length-1])
        }
        setTimeout(() => {
            setIsModalOpen(false);
        }, 200);
    };
    return (
        <div>
            <input
                onClick={openModal}
                id="hello"
                type="text"
                placeholder="Chọn ngành hàng"
                class="block  w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"

            />

            {isModalOpen && (
                <div id="myModal" className="relative z-10 opacity-0 transition-opacity duration-300 ease-out">
                    <div
                        id="modalOverlay"
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                        onClick={closeModal}
                    ></div>

                    <div
                       className="fixed inset-0 top-[20px] left-[20px] z-[100] w-screen overflow-y-auto"

                    >
                        <div className="flex items-end justify-center text-center sm:items-center sm:p-0">
                            <div
                                id="modalPanel"
                                className="relative transform scale-95 transition-transform duration-300 ease-out overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-4xl"
                            >
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                                        Chỉnh sửa ngành hàng
                                    </h3>
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="Vui lòng nhập tối thiểu 1 ký tự..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex overflow-x-auto">
                                            {
                                              categories.map(v=>{
                                                return <ul  className='cursor-pointer w-1/3 border-r border-gray-200'>
                                                    {
                                                      v.map(v=><>
                                                        <li onClick={()=>{
                                                            setCChoose([v])
                                                    }} >{v.tenLoai}  {v.subCategories.length>0?">":""}</li>
                                                    </>)}
                                                </ul>
                                              })
                                            }
                                            {
                                              cChooose.map((v,id) => {
                                                return (
                                                  <ul className="w-1/3 border-r border-gray-200 cursor-pointer" >
                                                    {v.subCategories.map((subCategory) => (
                                                      <li key={subCategory.id} onClick={()=>{
                                                        let a=cChooose.splice(0,id+1)
                                                        a.push(subCategory)
                                                        setCChoose(a)
                                                      }} >
                                                        {subCategory.tenLoai} {subCategory.subCategories.length>0?<span onClick={()=>{
                                                            addSub(subCategory,id)
                                                        }} > > </span>:<spam></spam>}
                                                      </li>
                                                    ))}
                                                  </ul>
                                                );
                                              })
                                            }
                                    </div>
                                </div>

                                <div className="flex mt-2 ml-2 mr-2 flex items-center justify-between" >
                                    <p>
                                        Đã chọn: <strong> {cChooose.map(v=><span> {v.tenLoai} - </span>)}   </strong>
                                    </p>
                                    <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center" >
                                        {cChooose.length>0?<button  className='btn btn-danger' onClick={closeModal} type="button" >Xác nhận </button>:<></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySearch;

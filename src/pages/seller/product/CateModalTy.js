import React, { useEffect, useState } from 'react';
import api from '../../../config/APISeller';

const CateModalTwo =  ({setCate}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories,setC]=useState([])
    const [flag,setFlag]=useState(1)
    const [cChooose,setCChoose]=useState([])
    
    const addSub=(sub,id)=>{
      setCChoose((prevItems) => [...prevItems.splice(0,id+1), sub]);
      
    }
    let i=true;
    function listForEach(v){
        if(v.id===5){
            cChooose.push(v)
            i=false
            return
        }else if(v.subCategories.length){
            v.subCategories.forEach(v=>{
                listForEach(v)
            })
        }
        if(i==false){
            cChooose.push(v)
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/category/getall')
            .then((v) => v.json())
            .then((v) => {
                categories.push(v.data)
                for (let vv of v.data) {
                        if(i==true){
                            listForEach(vv)
                        }else{
                            break;
                        }
                }
                cChooose.reverse()
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
        if(cChooose.length>0&&cChooose[cChooose.length-1].subCategories.length==0){
            setCate(cChooose[cChooose.length-1])
        }
        document.getElementById('myModal').classList.add('opacity-0');
        document.getElementById('modalPanel').classList.add('scale-95');
        setTimeout(() => {
            setIsModalOpen(false);
        }, 300);
    };

    return (
        <div>
            {/* Button to open modal */}
            {/* <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Open Modal
      </button> */}

            <input
                onClick={openModal}
                id="hello"
                type="text"
                placeholder="Chọn ngành hàng"
                class="w-full md:w-3/12  p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                style={{ width: '100%' }}
            />

            {/* Modal */}
            {isModalOpen && (
                <div id="myModal" className="relative z-10 opacity-0 transition-opacity duration-300 ease-out">
                    {/* Background backdrop */}
                    <div
                        id="modalOverlay"
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                        onClick={closeModal}
                    ></div>

                    <div
                        className="absolute inset-0 z-10 w-screen overflow-y-auto"
                        style={{ position: 'fixed', top: '20px', left: '20px', zIndex: '100' }}
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

                                    {/* Search Bar */}
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="Vui lòng nhập tối thiểu 1 ký tự..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Category Selection with Horizontal Scroll */}

                                    <div className="flex overflow-x-auto">
                                        {/* <div style={{display:"flex"}} className="w-1/3 border-r border-gray-200"> */}

                                            {
                                              categories.map(v=>{
                                                return <ul style={{cursor:"pointer"}} className='w-1/3 border-r border-gray-200'>
                                                    {
                                                      v.map(v=><>
                                                        <li onClick={()=>{
                                                          setCChoose([v])
                                                }} >{v.tenLoai}  {v.subCategories.length>0?">":""}</li>
                                                      </>)
                                                    }
                                                </ul>
                                                  
                                              })
                                            }
                                            {
                                              cChooose.map((v,id) => {
                                                return (
                                                  <ul className="w-1/3 border-r border-gray-200" style={{cursor:"pointer"}}>
                                                    {v.subCategories.map((subCategory) => (
                                                      <li key={subCategory.id} onClick={()=>{
                                                        if(subCategory.subCategories.length==0){
                                                            cChooose.push(subCategory)
                                                            // setCate(subCategory)
                                                            setFlag(flag+1)
                                                        }
                                                      }} >
                                                        {subCategory.tenLoai} {subCategory.subCategories.length>0?<span onClick={()=>addSub(subCategory,id)} > > </span>:<spam></spam>}
                                                      </li>
                                                    ))}
                                                  </ul>
                                                );
                                              })
                                            }
                                    </div>
                                </div>

                                <div className="flex mt-2 ml-2 mr-2" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p>
                                        Đã chọn: <strong> {cChooose.map(v=><span> {v.tenLoai} - </span>)}   </strong>
                                    </p>
                                    <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" style={{ alignItems: 'center' }}>
                                        {cChooose.length>0&&cChooose[cChooose.length-1].subCategories.length===0?<button  className='btn btn-danger' onClick={closeModal} type="button" >Xác nhận </button>:<></>}
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

export default CateModalTwo;

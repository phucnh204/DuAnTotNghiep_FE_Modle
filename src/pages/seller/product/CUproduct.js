import TabNavigation from './tab';
// import anhdow from '../../../utils/images/seller/anhdow.png';
import CategoryModal from './ModalCategory';
import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
import DescriptionAlerts from './Loader';
import FileUpload from './IconUploadFile';
import {LuUploadCloud } from 'react-icons/lu';
import { MdDeleteOutline} from 'react-icons/md';
import { TiDelete } from 'react-icons/ti';
import ToggleSwitch from './Toglle';
// import api from '../../../config/APISeller';

const CUProduct = () => {
    const componentRef = useRef(null);
    // const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isPhanLoai,setIsPhanLoai]=useState(false)
    const [variant,setVariant]=useState({"soLuong": 2, "giaBan": 1000, "hinhAnh":"", "mauSac": {"id": 1}, "kichThuoc": {"id": 1}})
    const [flag,setFlag]=useState(0)
    const [isRender,setIsRender]=useState(false)
    const [listProductDetail,setListProductDetail]=useState(new Map())
    const [cate,setCate]=useState(null)
    const [data,setData]=useState({
        mauSac:[],
        kichThuoc:[],
        thuongHieu:[]
    })
    const [product,setProduct]=useState({
        "trangThai":1,
        "tenSanPham":"Demo"
    })
    const apliVariant=()=>{
        let sl=document.getElementById("soLuongPopu").value
        let pr=document.getElementById("pricePopu").value
        if(Number(sl)&&sl>0&&Number(pr)&&pr>999){
            sl=parseInt(sl)
            listProductDetail.forEach((details, productName) => {
                details.soLuong = sl;
                details.giaBan = pr;
            });
            setFlag(flag+1)
        }else{
            alert("Số nhập không hợp lệ")
        }
    }

    const submit=()=>{
        if(cate!==null){
            product.category=cate
            product.productImages=images
            if(isPhanLoai){
                product.productDetails=Array.from(listProductDetail.values());
            }else{
                product.productDetails=[variant]
            }
            if(window.confirm("Bạn chắc chắn với các thông tin này")){
                fetch('http://localhost:8080/sale/product/addproduct', {
                    method: 'POST', // Phương thức POST
                    headers: {
                      'Content-Type': 'application/json', // Định dạng JSON
                    },
                    body: JSON.stringify(product) // Convert object to JSON string
                  })
                  .then(response => response.json()) // Parse JSON response
                  .then(data =>{
                    if(data.status===200){
                        alert(data.message)
                    }else{
                        alert(data.message)
                    }
                  })
                  .catch((error) => console.error('Error:', error));
            }
        }else{
            alert("Chưa chọn cate")
        }
    }


    
    function checkMau(id){
        let a=data.mauSac[id]
        a.isCheck=!a.isCheck
        setIsRender(!isRender)
    }

    function checkKichThuoc(id){
        let a=data.kichThuoc[id]
        a.isCheck=!a.isCheck
        setIsRender(!isRender)
    }

    useEffect(()=>{
        const mauTamp=data.mauSac.filter(v=>v.isCheck)
        const kichThuocTamp=data.kichThuoc.filter(v=>v.isCheck)
        // console.log(mauTamp)
        // console.log(kichThuocTamp)
        mauTamp.forEach(v=>{
            kichThuocTamp.forEach(vv=>{
                // console.log(!listProductDetail.has(`${v.tenMau} ${vv.tenKichThuoc}`))
                if(!listProductDetail.has(`${v.tenMau} ${vv.tenKichThuoc}`)){
                    // console.log("tổ hợp")
                    listProductDetail.set(`${v.tenMau} ${vv.tenKichThuoc}`,{
                        mauSac:v,
                        kichThuoc:vv,
                        soLuong:1,
                        giaBan:1000,
                        hinhAnh:''
                    })
                }
            })
        })
        setFlag(flag+1)
        // console.log(listProductDetail)
    },[isRender])

    const fetchMauSac = () => {
        return fetch("http://localhost:8080/mausac/getall").then(v => v.json());
    };
    
    const fetchKichThuoc = () => {
        return fetch("http://localhost:8080/kichthuoc/getall").then(v => v.json());
    };
    
    const fetchThuongHieu = () => {
        return fetch("http://localhost:8080/thuonghieu/getall").then(v => v.json());
    };
    
    // Sử dụng Promise.all để thực hiện đồng thời
    useEffect(()=>{
        Promise.all([fetchMauSac(), fetchKichThuoc(), fetchThuongHieu()])
        .then(([mauSacResponse, kichThuocResponse, thuongHieuResponse]) => {
            data.mauSac=(mauSacResponse.data);
            data.kichThuoc=(kichThuocResponse.data);
            data.thuongHieu=(thuongHieuResponse.data);
            product.thuongHieu = thuongHieuResponse.data[0]; 
            setFlag(flag+1)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    },[])


    const handleFileChangeKey=(e,key)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);
        setLoading(true);

        fetch('http://localhost:8080/upload-single-files', {
            method: 'POST',
            body: formData,
        })
            .then((v) => v.json())
            .then((v) => {
                let k=listProductDetail.get(key)
                if(key!==null){
                    k.hinhAnh=v.data
                }
            }).catch(error=>{
                alert("Có lỗi xảy ra ")
            }).finally(()=>{
                setLoading(false);
            })
    }

    const handleFileChangePopu=(e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);
        setLoading(true);

        fetch('http://localhost:8080/upload-single-files', {
            method: 'POST',
            body: formData,
        })
            .then((v) => v.json())
            .then((v) => {
                listProductDetail.forEach((details, productName) => {
                    if(details.hinhAnh===""){
                        details.hinhAnh=v.data
                    }
                });
            }).catch(error=>{
                alert("Có lỗi xảy ra ")
            }).finally(()=>{
                setLoading(false);
            })
    }

    function handleFileChanges(e){
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);
        setLoading(true);
        fetch('http://localhost:8080/upload-single-files-video', {
            method: 'POST',
            body: formData,
        })
            .then((v) => v.json())
            .then((v) => {
                    product.video=v.data
                    alert(product.video)
            }).catch(error=>{
                alert("Có lỗi xảy ra ")
            }).finally(()=>{
                setLoading(false);
            })
    }

   
    const handleFileChange = async (e) => {
        let selectedFiles = Array.from(e.target.files);

        // Giới hạn số lượng file tối đa là 5
        if (selectedFiles.length > 5) {
            selectedFiles = selectedFiles.slice(0, 5);
        } else {
        }
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });
        setLoading(true);

        fetch('http://localhost:8080/upload-multiple-files', {
            method: 'POST',
            body: formData,
        })
            .then((v) => v.json())
            .then((v) => {
                setImages(v.data);
                product.hinhAnh=v.data[0].hinhAnh
            }).catch(error=>{
                alert("Có lỗi xảy ra ")
            }).finally(()=>{
                setLoading(false);
            })
    };
    return (
        <>
            <div >
            <CategoryModal  setCate={setCate}></CategoryModal></div>
            <div className={`absolute right-1 top-[11%] z-[13] ${isLoading ? 'visible' : 'hidden'}`}>
                <DescriptionAlerts />
            </div>
            <div ref={componentRef} style={{ scrollBehavior: 'smooth' }}>
                <TabNavigation />
                <div id="productinfo" className="container mt-2 mx-auto p-4  bg-white " style={{ borderRadius: '7px' }}>
                    <p className="font-bold">Thông tin cơ bản</p>
                    <div>
                        {/* Ảnh sản phẩm */}

                        <div class="container mx-auto mt-3">
                            
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">
                                    Hình ảnh sản phẩm.
                                </div>

                                <div class="col-span-12 lg:col-span-10 flex items-center">
                                    {images.map((v,index) => {
                                        return (
                                            <div
                                                style={{ borderRadius: '5px' ,position:"relative"}}
                                                className="w-1/5 p-1 flex justify-center items-center border mr-2"
                                            >                                                <img width={"50px"} src={v.hinhAnh}/>
                                                        <p onClick={()=>{
                                                            if(images[index]!=null){
                                                                images.splice(index, 1);
                                                                setFlag(flag+1)
                                                            }
                                                        }} style={{position:"absolute",right:"0px",top:"0px",zIndex:"12"}}><TiDelete size={20}/></p>
                                                    
                                            </div>
                                        );
                                    })}

                                    <input onChange={(e) => { 
                                            handleFileChange(e); 
                                        }}
                                        style={{ display: 'none' }}
                                        id="images"
                                        type="file"
                                        multiple
                                        accept=".jpg,.jpeg,.png"
                                    />
                                    <FileUpload tar="images" />
                                </div>
                            </div>
                        </div>
                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">
                                    Ảnh đại diện
                                </div>
                                <div class="col-span-12 lg:col-span-10 flex items-center">

                                    {product.hinhAnh===""?<FileUpload tar="avatar" />:<><img width={"50px"} src={product.hinhAnh!==""?product.hinhAnh:""}></img>

                                    <input
                                        onChange={(e) => {
                                            handleFileChange(e);
                                        }}
                                        style={{ display: 'none' }}
                                        id="avatar"
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                    /></>}
                                </div>
                            </div>
                        </div>



                        {/* Video */}
                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">
                                    Video Sản phẩm
                                </div>

                                <div class="col-span-12 lg:col-span-10 flex items-center">
                                    
                                <video style={{ width: "200px" }}  controls>
                                    <source src={product.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                    <input
                                        onChange={(e) => {
                                            handleFileChanges(e);
                                        }}
                                        hidden
                                        style={{ display: 'none' }}
                                        id="videoProduct"
                                        type="file"
                                        
                                        accept=".mp4,.avi,.mkv"
                                    />
                                    {/* <CustomFileUpload/> */}
                                    <FileUpload tar="videoProduct" />
                                </div>
                            </div>
                        </div>

                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Tên sản phẩm</div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <input
                                    value={product.tenSanPham}
                                    onChange={(e)=>{
                                        product.tenSanPham=e.target.value
                                        setFlag(flag+1)
                                    }}
                                        type="text"
                                        placeholder="Nhập tên sản phẩm."
                                        class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                                    {product.tenSanPham===""||product.tenSanPham.length<10||product.tenSanPham.length>150?<p className="hidden lg:block text-xs mt-2 text-danger">Số lượng ký tự lớn hơn 10 và nhỏ hơn 150</p>:<></>}
                                    <p className="hidden lg:block text-xs mt-2 text-warning">Giới hạn 150 ký tự ( 2/150 )</p>
                                </div>
                            </div>
                        </div>

                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">mô tả sản phẩm</div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <textarea
                                    value={product.moTa}
                                    onChange={(e)=>{
                                        product.moTa=e.target.value
                                        setFlag(flag+1)
                                        // alert(ỏ)
                                    }}
                                        // type="text"
                                        placeholder="Nhập tên sản phẩm."
                                        class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                                    <p className="hidden lg:block text-xs mt-2 text-danger"></p>
                                    <p className="hidden lg:block text-xs mt-2 text-warning">Giới hạn 150 ký tự ( 2/150 )</p>
                                </div>
                            </div>
                        </div>

                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Ngành hàng</div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <input
                                        onClick={() => {
                                            document.getElementById('hello').click();
                                        }}
                                        value={cate!=null?cate.tenLoai:""}
                                        style={{cursor:"pointer"}}
                                        type="text"
                                        placeholder="Chọn ngành hàng"
                                        class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                                    <p className="hidden lg:block text-xs mt-2 text-danger"></p>
                                    <p className="hidden lg:block text-sm mt-2 ">> {cate!=null?cate.tenLoai:""}</p>
                                </div>
                            </div>
                        </div>

                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Thương hiệu</div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <select class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    >
                                        {
                                            data.thuongHieu.map((v,index)=><option onClick={()=>{
                                                if(data.thuongHieu[index]!==null){
                                                    product.thuongHieu=data.thuongHieu[index]
                                                }
                                            }}>{v.tenMau}</option>)
                                        }
                                    </select>
                                    <p className="hidden lg:block text-xs mt-2 text-danger"></p>
                                </div>
                            </div>
                        </div>
                        <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Được mua khi hết hàng </div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <ToggleSwitch/>
                                    <p className="hidden lg:block text-xs mt-2 text-green">! Người dùng được phép thêm, mua hàng đối với sản phẩm này khi hết hàng</p>
                                </div>
                            </div>
                        </div>

                        {/* ******** */}
                    </div>
                </div>
                {/* Thông tin chi tiết  */}
                <div id="productdetail" className="container mt-2 mx-auto p-4 relative bg-white " style={{ borderRadius: '7px' }}>
                
                    <p className="font-bold">Thông tin biến thể</p>
                    
                    {/* Sản phẩm mặc định */}
                    <div className="mt-5  flex items-center justify-start" style={{ alignItems: 'start' }}>
                        <span className="text-sm w-1/6">
                            <strong className="text-danger">* </strong> Sản phẩm mặc định
                            <div class="flex items-center mb-4">
                            </div>
                        </span>
                        <div className=" w-5/6 relative  rounded-md shadow-md p-3">
                            <button 
                                onClick={()=>{
                                    setIsPhanLoai(!isPhanLoai)
                                }}
                                style={{border:"1.5px dotted gray",hover:""}}
                                class=" mb-3  text-red-500   px-4 py-2 mt-2 md:mt-0 rounded hover:bg-red-50"
                            > + Thêm phân loại</button>
                            <p className="mt-1 mb-3 text-xs">Giá bán</p>
                            <input
                                disabled={isPhanLoai}
                                value={variant.giaBan}
                                onChange={(e)=>{
                                    variant.giaBan=e.target.value
                                    setFlag(flag+1)
                                }}
                                type="text"
                                placeholder="Nhập giá bán"
                                class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                            {variant.giaBan<1000?<p className="mt-1 text-xs text-danger">Giá vui lòng lớn hơn = 1000</p>:<></>}
                            <p className="mt-3 mb-3 text-xs">Số lượng</p>
                            <input
                                value={variant.soLuong}
                                disabled={isPhanLoai}
                                onChange={(e)=>{
                                    variant.soLuong=e.target.value
                                    setFlag(flag+1)
                                }}
                                type="text"
                                placeholder="Nhập số lượng"
                                class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                {variant.soLuong<1?<p className="mt-1 text-xs text-danger">Giá vui lòng lớn hơn = 1000</p>:<></>}
                        </div>
                    </div>

                    {/* Tên sản phẩm */}
                    <div className="mt-5 transition-all duration-500 ease-in-out flex items-center justify-start" 
                    style={{ alignItems: 'start',height:`${isPhanLoai?"":"0px"}`,overflow:"hidden" }}>
                        <span className="text-sm w-1/6">
                            <strong className="text-danger">* </strong> Sản phẩm biến thể
                            <div class="flex items-center mb-4">
                            </div>
                        </span>
                        <div className="w-5/6 relative  rounded-md shadow-md p-3">
                            <p className="mt-2 mb-3 text-xs">Màu sắc ( Chọn )</p>
                            {
                                data.mauSac.map((v,index)=>{
                                    return <>
                                        <input
                                            onClick={()=>{
                                                checkMau(index)
                                            }}
                                            id="default-checkbox"
                                            type="checkbox"
                                            value=""
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            for="default-checkbox"
                                            class="inline-block pr-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            {v.tenMau}
                                        </label>
                                    </>
                                })
                            }
                            
                            <p className="mt-3 mb-3 text-xs">Kích thước ( Chọn )</p>
                            {
                                data.kichThuoc.map((v,id)=>{
                                    return <>
                                        <input
                                        onClick={()=>{
                                            checkKichThuoc(id)
                                        }}
                                            id="default-checkbox"
                                            type="checkbox"
                                            value=""
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            for="default-checkbox"
                                            class="inline-block pr-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            {v.tenKichThuoc}
                                        </label>
                                    </>
                                })
                            }

                            <div class="relative overflow-x-auto mt-3">
                                <div className='mt-3 mb-3'>
                                    <input
                                        id='soLuongPopu'
                                        type="number"
                                        placeholder="Số lượng"
                                        class="w-5/12 mr-2 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    /> 
                                    
                                    <input
                                        id='pricePopu'
                                        type="number"
                                        placeholder="Giá bán"
                                        class="mr-2 w-5/12 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                                    <button onClick={()=>{
                                        apliVariant()
                                    }} className='text-white text-sm p-1 mr-2'  style={{backgroundColor:"orangered",borderRadius:"5px"}}>Áp dụng cho tất cả </button>
                                    <input onChange={(e)=>{
                                            handleFileChangePopu(e);
                                    }} id='filepopu' type='file' style={{display:"none"}} ></input>
                                    
                                    <div onClick={()=>{
                                            document.getElementById("filepopu").click()
                                        }} className='cursor-pointer p-2.5 border border-dashed border-red-500 rounded inline-block text-center'>
                                        <LuUploadCloud color='blue' size={24}/>
                                        <span className='text-xs '  style={{color:"orangered"}}>Upload cho sp chưa có ảnh</span>
                                    </div>
                                </div>
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                Tên biến thể
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Hình ảnh
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Số lượng
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Giá bán
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {Array.from(listProductDetail).map(([key, value]) => (
                                    <tr
                                    class="bg-white  dark:bg-gray-800 dark:border-gray-700"
                                    style={{ borderBottom: '1px dotted lightgray' }}
                                        >
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                                                {key}
                                            </th>
                                            <td class="px-6 py-4" style={{cursor:"pointer",position:"relative"}}> 
                                                {
                                                    value.hinhAnh=== ''?<>
                                                        <LuUploadCloud onClick={()=>{
                                                            document.getElementById(key).click()
                                                        }} color='blue' size={22}/>
                                                        <input onChange={(e)=>{
                                                            handleFileChangeKey (e,key)
                                                        }} hidden type='file' id={key}/>
                                                    </>: <>
                                                        <img width={"50px"} src={value.hinhAnh}/>
                                                        <p onClick={()=>{
                                                            listProductDetail.get(key).hinhAnh=""
                                                            setFlag(flag+1)
                                                        }} className='absolute right-0 top-0 z-12'><TiDelete size={20}/></p>
                                                    </>
                                                }
                                                {/* handleFileChangeKey */}
                                            </td>
                                            <td class="px-6 py-4">
                                                <input
                                                    style={{ border: '1px solid gray' }}
                                                    type="text"
                                                    name="price"
                                                    id="price"
                                                    value={value.soLuong}
                                                    onChange={(e)=>{
                                                        value.soLuong=e.target.value
                                                        setFlag(flag+1)
                                                    }}
                                                    className="block w-3/6 rounded-md border-1 py-1.5 pl-7 pr-20 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    placeholder="12000đ"
                                                />
                                                <p className="text-danger text-xs">{value.soLuong<1?"* Số lượng phải lớn hơn 0":""}</p>
                                            </td>
                                            <td class="px-6 py-4">
                                                <input
                                                    style={{ border: '1px solid gray' }}
                                                    type="text"
                                                    name="price"
                                                    value={value.giaBan}
                                                    onChange={(e)=>{
                                                        value.giaBan=e.target.value
                                                        setFlag(flag+1)
                                                    }}
                                                    id="price"
                                                    className="block w-3/6 rounded-md border-1 py-1.5 pl-7 pr-20 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    placeholder="12000đ"
                                                />
                                                <p className="text-danger text-xs">{value.giaBan<1000?"* Số lượng phải lớn hơn 1000":""}</p>
                                            </td>
                                            <td onClick={()=>{
                                                listProductDetail.delete(key)
                                                setFlag(flag+1)
                                            }} style={{cursor:"pointer"}} > <MdDeleteOutline color='red' size={25} /></td>
                                        </tr>
                                        ))}
                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                onClick={()=>{
                    submit()
                }}
                    type="button"
                    class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg mt-3 text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                    Lưu
                </button>
            </div>
        </>
    );
};

export default CUProduct;

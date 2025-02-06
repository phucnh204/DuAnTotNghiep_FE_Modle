// import { useEffect, useRef } from 'react';
import TabVoucher from './tabVoucher';
import api from '../../../config/APISeller'; // Import Axios instance
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Pagination, PaginationItem, Select, Stack } from '@mui/material';
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from 'react-icons/io5';
import { CiFilter } from 'react-icons/ci';
import { BiSortDown } from 'react-icons/bi';

const ListVoucher = () => {
    let { type } = useParams();
    const [typeFetch, setTypeFetch] = useState(type);
    // const [numPage, setNumPage] = useState(3);
    // const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [vouchers, setVouchers] = useState([]);
    // const [key, setkey] = useState('');
    const [filter,setFilter]=useState({
        typeSort:0,
        typeFilter:[],
        numPage:0,
        page:0,
        key:""
    })
    useEffect(() => {
        getVoucherList();
    }, [typeFetch]);


    // const getVoucherList = () => {
    //     api.get(`/voucher/getvoucher?page=${page}&size=${size}&type=${typeFetch}&key=${key}&typeSort=${filter.typeSort}`)
    //         .then((v) => v.data)
    //         .then((v) => {
    //             setVouchers(v.data.content);
    //             setNumPage(v.data.totalPages);
    //         })
    //         .catch((error) => {
    //             alert('Có lỗi fetch voucher !!!');
    //         });
    // };

    const getVoucherList = () => {
        api.post(`/voucher/getvoucher?page=${filter.page}&size=${size}&type=${typeFetch}&key=${filter.key}&typeSort=${filter.typeSort}`,filter.typeFilter,{
            headers:{
                "Content-Type":"application/json"
            }
        }).then((v) => v.data)
            .then((v) => {
                filter.numPage=v.data.totalPages
                setVouchers(v.data.content);
                // setNumPage(v.data.totalPages);
            })
            .catch((error) => {
                alert(error)
                alert('Có lỗi fetch voucher !!!');
            });
    };



    return (
        <div>
            <div className="container mx-auto p-4 relative bg-white rounded-[7px]">
                <p className=" font-semibold">Kênh người bán * Quản lý voucher * voucher cua shop</p>
                <div className=" border-gray-200 relative"></div>
            </div>
            <div className="shadow-lg mt-2 container mx-auto p-4 relative bg-white rounded-[7px]">
                <p className="font-semibold">
                    
                </p>
                <VoucherReport/>

                {/* danh sách mã giảm giá  */}
                <div className="flex justify-content-between">
                    <p className="font-semibold">Danh sách mã giảm giá </p>
                    <button class="flex items-center border border-red-500 text-red-500 px-4 py-2 mt-2 md:mt-0 rounded hover:bg-red-100">
                        + Thêm voucher
                    </button>
                </div>

                <TabVoucher setTypeFetch={setTypeFetch} />
                <br />
                <input
                    // value={key}
                    onChange={(e) =>{
                        filter.key=e.target.value
                    }}
                    type="text"
                    placeholder="Tên voucher, mã voucher"
                    class="w-4/12 mr-2 p-2 d-inline-block lg:w-5/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
                <div class="inline-flex items-center border border-gray-200 rounded focus-within:ring-1 focus-within:ring-blue-400">
                    <BiSortDown class=" text-gray-500" />
                    <select onChange={(e)=>{
                        filter.typeSort=e.target.value
                        getVoucherList()
                    }} class="w-full mr-2 p-2 border-0 focus:outline-none focus:ring-0 text-sm">
                        <option value={0}>Mới nhất</option>
                        <option value={1}>Theo số lược dùng</option>
                        <option value={2}>Theo số lược dùng mỗi người</option>
                        <option value={3}>Theo tên</option>
                    </select>
                </div>
                <div class="inline-flex ml-2 items-center border border-gray-200 rounded focus-within:ring-1 focus-within:ring-blue-400">
                    <CiFilter class=" text-gray-500" />
                    <select onChange={(e)=>{
                        switch (e.target.value) {
                            case "0":
                                filter.typeFilter=[]
                                break;
                            case "1":
                                filter.typeFilter=[1]
                                break;
                            case "2":
                                filter.typeFilter=[0]
                        }
                        getVoucherList()
                    }} class="w-full mr-2 p-2 border-0 focus:outline-none focus:ring-0 text-sm">
                        <option value={0}>All</option>
                        <option value={1}>Theo tiền</option>
                        <option value={2}>Theo phần trăm</option>
                    </select>
                </div>
                <button
                    onClick={() => getVoucherList()}
                    class="flex mb-2 ml-2 d-inline-block border-red-600 text-red-600 items-center border  p-2 mt-2 md:mt-0 rounded"
                >
                    Tìm kiếm
                </button>
                <div className='mb-1 mt-1'></div>
                <Stack spacing={2}>
                    <Pagination
                        onChange={(event, value) => {
                            filter.page=value-1
                            getVoucherList()
                        }}
                        count={filter.numPage}
                        renderItem={(item) => (
                            <PaginationItem slots={{ previous: IoArrowBackCircleOutline, next: IoArrowForwardCircleOutline }} {...item} />
                        )}
                    />
                </Stack>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
                    <Select
                        style={{ height: '50px' }}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={size}
                        label="Age"
                        onChange={(event) => setSize(event.target.value)}
                    >
                        <MenuItem value={5}>5 </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControl>
                <div class="mt-2 relative  shadow-md sm:rounded-lg overflow-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Tên mã giảm giá
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Loại giảm giá
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Số sản phẩm áp dụng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Giá trị giảm
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Số lượt tối đa
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Số lược đã dùng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Lượt dùng mỗi người
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Thời gian áp dụng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {vouchers.map((v) => {
                                return (
                                    <>
                                        <tr class="bg-white border-b dark:bg-gray-200 dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-content-lg-between">
                                                    <img
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA21BMVEW9Gxv///+8GhrNKirOKyv/zgHAHh66AADDISHKJyfGJCS7AAC9GBi8ERHx19e8FRXKWFjjsrK5ABy8Dg7/1QD/1gD++vr+zRq7CAjbl5fty8vv0dHYjIy7EBvhqqr25OTeoKDRdHT78fHqw8PLX1/BLhrTe3vNZWX039//0xrHTEzCNTXPbGzaeBLovb3FRETAKirjkBDZj4/CMzPUgYH7xQTIUVH0txrLTRfJSRjGRkbeghHOVxvWbhTuqRrrohrUaRvGPBvysArqkBj6whrHCCrNHh7YcxPomxrwbIhkAAAgAElEQVR4nN1dCVvbOrN25FSyHSeBBNKwhECg7AUKlG70nLan323//y+6mtE2kuWFbue7d56nJXG86NXsI1lKijxFKljCE6A8Y0nC01R9SxLzq/6Ix7K+/MT75pR6KvrmUwb/sb66UcEK/JTpH3mGBxNWmLPhAIOm6YeYT9zeMGEZeT6PtIUV2OAiUxBz9Wy4L0Lsp+ba1D5HHlRY4dn9rMhZG8LM9gJFyDOWewgzjZKZRhTmcSk+g2X6ySzN7DN5Rh6fJRWSvYgI+xGIslWM93X78e5pyvQ1qg/x4Um/etuAHJ+xkylCRGXaB2i55iU+M9Es6KueMdKTpRaV7Y2E3IgCVO1Ok1RCLEKI6gTdR6ovLO9UpxbIxKKViX0riIgwrUGoG2zkTp9seha0oq9Y6KB4MloPUCKU1/IAIgoJsxJG9aFPFCNlafXOwXOsVKlGq0dwLhHyKkLLFqsTqpexAdgkohdZIwsZ1wDTJIfu4ZmyJxYiXM6cmUiNlEDPWM3oZ1nWwkTmek3ZDmRpBghJyxA9VUPsjcIaNt7XUJ1tY80AlfVQjEHdyrlSRgdRPcN0GadySvqVtdkad4sYQqujia+G6tKUPBOllRGt4M0ymmiAKWeaG1WI+BDDARRqJ54GNTCxGWHCowih+cwTUvvPEj5Sfexrg0MsGzm1DSCIrLxVnmR5PwLRszYabJ9YnVaHkXpS0YjQs47IOGvV4AOReNbSsRpfzo3tTBREQJFnvn1MqbWxcqqOgdXJYj1IiPkIC24Q5jGE9EoqNcospVEZjTwzNwDJQck/CTGLQMwtVvLE3HjHnLXYGmavDxAWzNNDzv12o15Ym6ZY6BjXyEKWI8K+B1C1NgqRe9ZGP1xBZYC5jYcFNSdxhNqSeu3GqMk9JfFZ2AWgfbCRVNnsXPYiQvT4YoIjGznJe+h4B3u3BWIWRZiQ6CuKEPuT6U+57+wbe5UVGqD+Lv2hgcglXxkHP+JDZOaGrlsT5zFao2/rAbjDiwjJKVWEKmbST0W1J87+SQBTKYX217SfRiGaJ9vo0Mblun8byUdoDpHwK9HRjaeGKWGhite802sBKqdnY0VoME+sTQV7A9/RPXqCmrgLCm1k9N9WJrJOCCNCap+g4rWiCwuZCrENQK6itsw6PbQ3ALEPcVyENxDsGfXvG8xtTIwiJJJTK6Tqo/a+nVgoAeYhwBRDIevmwZokkLfWQQSXqa7uG1PexkRqafQXTkIdK6RJIKRGWJCFhW1N09M4Bch0aAqfCma7FA43QszdoxUzjV39aYS06VRWsBlpm7bjVXnhnLYBmGIWIQ1PTnQtAT9QAzFxbirXlqA9D640Rfa2h9AIqiabhoI/Yjonb6e86FcBQo7PwCE4OVBhv4SYRSFyJ6faY/Tb8+Aqwiw44PPQdqNOlNvLJQkUmLB6pEDY9BByfJRQ7qyVEkDpHqMQQVWNnKpf0yczsQ2hSUK1tndjYQ3ANLE5htRHB4Jjy7N4BcsGbZ7neBLCpIKQ2pncensVr3W4v+wFE1X6ABVCU5GxEDmCroOYWzlV35/KxEDr3EFDfe3tE83C9lvKcDCNA1QIU8OFwjp/hCi7MBoDWm9szMHTmFhB6AspeKCM2Ous/e4+wIwC1Ai1Msofnb2REFkNRG7l1NiDpwCs2JWqkPos/CmAaVIU+oBWRhffZAx7MQJRBwY2o+FPY2IQg4YIuTFlWR//byuUQPEb3EscoPQWeabZGCoj8BOMTgyijUuNOD0BYOjezTF779ToNz6jlYXNAFFKM8VGE5yY1BHTpjqIuXFY6nu/JdWvB1Q5wMwoiWJhETMEAUBp3f0CvYdQ1UvVlzxR0mHsDUIEixl5irGnRqB+EiH5ySh53o2FnGdNAFOMwKWd0doYKCNexdNYi7Tu6QEgOmLycwilxBtvD2amqD0xBrCoAkyhnAA14Yx7bsPX7phDMkV/XQLknWJj167aX5gN2HAIrM2E8Yz3TaOjACXCPJdxH5yFv2u30QViruXUNKgTNNOw2l8yw5C0EwtbAXIZP+RSs7O0n3JO3EZgz2NP0rbOtPZJTKxFqGNtsNJJEoavVcqStAagrihKywJSnKeY2GeajVkVYrwzafKrmtSV6nnY1z2Fzr5NRjPWDDBjLJMY5U+FZIeqtVFl9CDGBlk5dYMdYg9HtQhNBIh+vq2gjsOQMYBYMgUGysASGyrz9EIKpzwJ/7PKGAYeITFvnLs9+Gi8mbqjDgBZFxZWAebaXOaKTyyx4y4yrCnA/UA2y6kytjTUsy+tMtWFDAt50spC4IYHMDeTLjQCKM7YJoEXyuTBDFhb9F0M10Z0FLjVLrSSCkVNZzX3GAWYo+BpgJl2Ccyv3QP/MsXGDNnYMZimBYa2Ma92ssUf3no34AanAHWxG1P9vpr6ECCQPEU2cvkUNTDcqU2e9nUqGDU1u2+KcYlxyS9qzkx8gKnKH/qZGtJm8bZIdYTpFaxAnFYZm8nzIz+JkFouxcLFh4+L2JkcOqMKMOV5v0X6ioJDB4AJyvsdlfGJaUUDMTJeo5T6xZu/vDMsXJ4SgDoDlLzLW/kivSMvCiiP68HvTpXY7hhabkTmA6l+Wzx6LHzxwXylY9P9AlMKTJEquhWpFspYNl8wLNnIOCeNnFJp2FNQNJAbQAmDRsO7xVv9IacAMwUw4zGpi8abk1ePwMIMxxQ7KeOvIVZhoSHLSvXHVd9QKvX8NRl/ho1lWbTUuni3+XUC3cnRhzy9pP2jVD+C9vkDFVZn3HCuFLpvSI2qLS0keyMiNnn9bPPjAjQxQfvazW38PNG6qO8LFx//npDz7I+odrnyf/JPVmUg5BQViJPvG8+evZ5AB+go/09Jau049uTNc4dw8cJaG2BdrpJAlSh5JBkYrTwsHjefPXu28WFiy/xs8s9TC00/RCQMpQgXi8mrs7MPFuKLv7RS4kghOgmwF0XIwCLJpRjGJlI8U4SfkY1SLx//gDKyGi18fPnm7Pnzs1fWnmqEinXIx6wqZQXPgKlMur4gcZ38tYEAN75DpyEbJ683Xk1+uzKypBxO5wP8zIlrT959eA509uaTPqakNIUBeRV4Ff3AJQADwdsxDF8kCIJx8nFT83BTi3sGevlmAmMYv56NrBxLVAKpvHu4vN8aaIBvbTy6mCRfnz9/k0w83w+yiVMOE5ckWio4Tqm2loS53HXxYuOZob+U5KNebiRkzvCvIQVrfH1yfLt3tX26mvWQhHrG4q+XDtDi3dnXhYePa9kE5UkDEwO5AE8UIwlpjJM3FuCzTR0/oMyi6OdPqVN4Dx1qPo0dwL3D0XLVq1BSKi18QRFNvn4LAeoaKKsOmRRmNLTi/aUpm3xwLHwGoilv/gUOSUXEc35IGYdCHG1dbW8fru9ei4F+rIigA7oYR4zf5G8vh+Km2iJzxMDE2KzXCqg3ASJ7t0kAPtuUqj35pg591cY6b5FUqVjSXkhuDc2RUry/cgCWu2KqEJ7GEa4NIwgXNIWC8U9QPqxGBF2uqww2aWVJOGb0lSKUbt/q5Yb2Viw2sxvshWo3G4zRXqxvP2iI0/GhD2F1JBDhdhzhwbSxBycvF1xZF6gUhv2dmUEJk1lBUuX3VfKaItx4afVy49PCRPuedxkrM3h9olrmZO94jr8PzmcVELcAUVxVjiPtzhsBPr6Z9LHUAtKZ+xJqykQWH+QNaZAcLZgH8ZnVS3SPun5PxGj8sG3sBSqYQ3iLnm2+FkUhwNLEEe4JH5OngJPH52cfpddAJ8EDJ2haZwU016MU/vjc4oWH0BkeVMTKQOLwwTZNGkHZ7pHX0vFNHMbDNBlsBceW+1vHJ9fDQQCQIvz8avP5880vj1gK5YGp1AUeE/qZURgOU7xzWpQKIDqzU5L7WBrf2RZegCdw2rUuPMABGsHmx7Pl6HBvy14wEoP5dFz69188+jx88fzs2wTnMQQN0X1vp8LCOAwk/ZKTOFMhJ0Hv4nMU4YYxZ96ty7Ft9RqYFrFuvm5LhNOTOEBpT+bgQ4B2HeqkSotPFCHL/vPy+ySW6QT4uCovqhGLJFXcLKwELt5txBB+n4S3hXuJGWm0RLhvvp6Cru04rh0N5gfO6OwYOPNjc2hWRSizir8e3WNlkLJ4+zYSIHPvD1OjvRpfBpanQI6mViEnbzd9cNp1RBAS0wLmIxlYlqxEUs577tu0LIUT6d5Ai+P0yB6al+HN3z5+P3tuKjPoqFyZuwqTCGgf8EH9Xl4BoViRyUyjL8kMQkweKcSNV0oRo6VZ57j3hXT24pKwZOhaf4k+wHG4Z9zl+NoeuqkgTN5+OTv7/vEzBVgX/lsBtfjs+yTSvGYSowKpGTn5RCB+VXHNRrQ060zLnpjenZ84DMPS6Zhm2fjCHtDuMikze+h6XLn7YvL6rUkppDlkeUvUqKqDGeIrqB9kMNwvjQ2ClMiZDdYA2eeFyhn/jompc9yzwLXfjZ1DmKmMgQn7667WunJgD51EopnFS/NQ6Pm8LQ0vAB+DMSeKz2gfsyChEyYvNcRNeMbidZ0i1jnuXu98OLi1X0QZILw3oUslCvIR0oJwy3QP9BCIr0D1c0QmBIG/ZAAy55MPCuIXwIXmdfNzREwJioAup85O9o6QP8P3VYaJpTm0NajePvnsmlmpNPn4uC62cX/ISWOlIOVHBjXW/7xCiEr9gaUb3yIICYqA7ufEioxQTEksas1KEAXVA2iUUHAMKgznwfEs9pqrBvmf7xsygdKiCaoYU8R6p741IM5SNp96d+LehU09rhoQsvicc/tz1s8jRpbh3P2aa2CEcvL3pgO1iCsi4VNAMmxzEY7EtLdHMkInke6cnQaEYRAaAElj+PS7CSm8R1Z39eS7VFrN9sXbzZgilqUHa+YKE5IlxDv4NBtY3+dHQXUA6+GBh4ji0y+XSK+RSZdf10OTxL3XJU3PyypC6gDe3wyEs63AEspESsfOqIh7c3DVpIf1VETwyUYX2r0D+xjU2tpmrgDEL18iYkqsvSgZSYpA1ZizlJTWCZapjYJMma0zQcVkONU1LqCBjhk4BKL9FD37k6h8FkPoW/u5z5LxMFJwuqJQhjZHniXVsC2KCgqsc+i+8uLhYHd//XC0BJO22tm6g2KewpdnHQY+Q1p8eqyKaWDtKUvg5/F8pxfQlser8kYmifeX72+mog4gK7EartiUXKxJVFcyYojJx+HNHKfT/gg8hBgJvgNrT5L+EltcinuPjdsXgbqVAlLfYVmGU0MkLAEWaSAGN+eX91t7hzu2boyWOpper/2PVj5zmx9C6iH0cl7JEvssE0kLcXCoQY62bkQ1vqaoxga1EDcPl/f7WSn2qrUsySxB+tajiyGNuHFSwlPVMUAYWHtnW49MyZRNJZuu1865swUh6YRf3GAtpOTW6VyPScpFaCTqDLVzOgw8hkxHUsgPfxymoDkvfF+Ottf3dw+OLrxbgtkjelbOjf3DvHe4ZuwFBjvMJRxrQxIJEZLnxaG7noWkEJAlkPrCUgoQdP8AzOkBgDvdudrTcYoyCPPhuP5mU8Hv10eSTbPT9YOBlNugm0i4dzzHB1RIJthx6NoXgf/jRgl5VqD7l57/SZNgFZU313oYKZYayN+H1gqaI2LNs6/rN2OCQvhl193BMFpy7c1LctHxyYMrTo4ED+aBMiQEKqEW7Yt5BBDGoRWEoQvAhJ/vjg5u99e3Ryvj5qfjsJ6/EgRF6Zdd90UY+q2WO+BfEkbMtpgOncwuw67OsVCjcTIM0rKsU5Bjesj/OhcDNXSB/nFgH6wDa/G+YhpvB6RyXCm7ltz+drl2oSOYwZzRqPdmTKK/SllSsy8vDE59XGaSrStCIKvwodaKBEHNPHjwNJKLiJLUMh7CsiuJfMVUBzHoeknQfy5bYP1/PEdBYEpOPeZxHsAkxkg6rUtlL5aHu6Xxc047sADq8kcEXA6qzm1feGXXqfSKnguKjDRqe2S/X+0duvtGawUUKBSlAiGVn429ENafDoaeK766UV1HVAqMxvDcfU3iyQZU8h2Ke5QIp1QiOtIY2COPyg7hreIeGAxz8nRN24uZycSd3BtS5bOgAEpiHBmBkdqh5PFoByRLDXBYFMvRinYceIVKZKurx/FB1q0uSRhGGGAvdu9KlFPSTjVOyGLDf9hWMpIBKkWct7QhxEnPDjSz7nzTEtIg+ihljyLQG2shDuClDHHV+bo6JDMGUw5VbI2Pb+4jO+zXS+gMp2FrQxos3ylnouO4uvFSEIRYwRLjlthFtwFAlQCHwUc5tBfoUq57yEiFZjXhBBQNiUrhWI21cQdTYlBsYU09vLHs6o00zlYyKtx7P6656JyYGTAqMjBN0E34boFcqsq01AMnia9OlJayQ4KU2F16OyBO4cgvcFfGSy2dTJ3DGV3fTW1CP4xfdD016CDsLnTkFvoE4mRHgV0+992V7NMdqu9SMJ12IJ+chu2Lcurfx1FT2dUl1SOIJtZUWr86GhLX6xKp2c1QoWvOJwiE6yFNa1FqaR30VvbmnUu2IW27Il/ordYFMTtuygU2oqns6irlM+oeJHR3EVHw1TiD+LoliyCD12AgXekeG03G/FTlwrEcjLtXbSPmc5s6b2PymJpCROr9W8eX7zkVhDI+GYBC73ECcSnCQDnKRMd26cbcNzQeRP61ZXV6e1P61TYyZjryCg/vURrmYmsURGAXMowuaW2EyDYlD/r1kDjHUZei3dD57d0B6XqcSeAETwe5hKkPwzAwtRp26ietx2AuLk91pEBKA1PvETuCKgUhCd2NMR8N+cDpSuMIiGWiFZMl6SuFyGmarhgQoT4aUu0oKcJRUASfneo2ycwgoTkvPIIKQjw6A6G3F0nZGg9lEn5/cg5l6Q4Aac1sTRz4neM6WJepSfB5PiQoLiGmticf+nMXHPk+BqcaeUl/vKgmoQ9Go0OomKzdgeaZol1MRBklw0R720OnZqoEQvRQGX3hBhFvSiJUqwshnBsA9xgfydgXjWVXL6TDBHj//vLhpuS6YjJtqpgksJZWX79YCrlwAdUbcI5Et9zTRWjaR5A0DZ0YAVNplY9G0TcYh1QCdqC1YX3ZVQam6xjH3B4fXXNdEQFedRFFJASFhRs/siFyYz5sK6EkoUlvW8rGnTNj4FtI31AyOX4sEDmeBoNsktcwZUqK4LF0mCavH1YKJp2I1Xj++YF5puXDrg76vJB3SYvr1xjyRPXmwhSIL8NfRncDY2VXpzv7KiQn5YrfRlUTZhpZOy54qFLEmIs+dqO+cy8NPr0ESR+fS3uhUKmz/sQrLPNQZdwAX00qMNPp9fy88tMxseAyZTq+Ol3NZrPl4daFnjM8brMXv4FYyEQ37Mfigvhg5ovM7/z0e3TtuyhV8h6I+jL/n6FwJsmly3jKGMQ1B2MsLq3nm12tiWHk9j83XtKBWJ2JsVQG4RKdWlfNvEc33oyfqRis3W9t7V5eiCi+30e6wI0l0jxtXhHQt+wjT9KYuKaOWNkLj6CePxhM/6wYwiS9Is+Jf29cHYU6vmodcihudg+X0l6cHt7eieYp9n+I7AzMSJAWJ08UryvCZpzWv2wvfoZMTQqDwadOlfi/QfOD4zUzetY2ivF/lKYyGEwyjMf/7ab8WuKKoCCHo+D/dnt+GTEFTWYaypXgawq/3TP/AdJjwJkaBU5THNrHaur/B3RqJju6R7X8CUz1/qnZGT/YjOm0+wMXsUn1tWRyfAVPyeWT2/fTNBUnJ7XTvkJavP30YjKZdIVp0f2LJmUsTlZQuevYtYuXmxvPvnx47AhTL/9VtA/b/y4qxYVMRK52ug1uJoAQ39zd2Hj914dHJlE2w0xxLsa/IpqKBgMZGy4fhIC3UDpdoRCqt0EkzL9fvl00wfx39M7SVNzPerN7mWGJ224DuB5CA/Pr95fvJtE3s/5lGou1JZRIIW2BCcUPNankC0/fQoQK5ebmh/86iKW4kTnm9o0yomO2rBtxWLz98rJ0IGMIn5lX6v+bSEAJcXmkU2dg4VX1DT1FixevN798MyB/J8JfaG6H4ngFA08mdR7c9g7rPeJi8WVzY+PLN1wd48cQtjcdpvT/MoCleH/a660PnAuULGyc6zP5DutzbHz5KO3m0xCqiLR1CUiW/cDUzNq7ifKq19u5IDwrk6AQVCH9rpkE+akWYTTUzNtbDi+8tS0X8RSaQ4lrdeLVrsbXrb5i8sks8GAxBQj/o+eV+PUZNxkxzkeAF3+v6AdpKC5XMDnLf92wzBpffEKavAu49sHDKBH2+2rKc547rImef1kzb5bBO5e1bw39AMkQbSRDtLISg4pVL3wbv0LSpHqQpOQSjFJKC5Mi6SwJsOIrbDVvYDB429J/ofYniYnBugyx30eMprSl23iYNaRRi8UbAnHjBVgdixH0MFF1iZTub1H3gglIp3qt9pfhkyHarlTAg3iRX5z2tnHO4EFTpjj5e5MghAOTl5qx2pbqKd1Qo1Br8dXCS/vR1xZ/nMbiaAlD2jWrl5RT6T+2169mzXMpzOu7BqHD6HkLhzN2E5YAvF+qfqCAdzJEO8zqk8BSbMFo12ymZmTW0eTjho8QMH6TGKv+MF7yZol+M//XphwDoXKkxpeCBuJu7Voct1jVyVuL0Jr/xeTj680uURvaln6KL6w3n7n4HHmRrZaGmCMdt49CjYdjUMijxmEQaVIND6HIpMqBi8k3unxkOC0BSSkfLjZcb17MS7Pv3rz5XHdOQOVQPKACimEnEg9tzn+RfN0wUgoyl8MCNKySA/tzLg28tNG8uAsWf/0dvqtXw9Pp4OEQcoj3a13pSE8IaCBc5sHoIcZcdRVCu+KJ2kk2TSvmhfCa8n3x9kWI6J8oxOFDdFpaMx00rhaFEF9tOkujZszmqpoWqfIq25J6K7hEMLWlH4uX0cMyVln3aSR9QiPtqKnILRBfbgbLrWgXVylmMw2vDV9d+uG0McpCJnqnwqet3qVopKmZm9QM8bG6oAzTnsAbkNABTj8PIXhaWrug/OJDs0lFhN6R+W50GRNHMgjvglAG4tElcwwrTfHe1EvDJdrpVsasYV/jyddmJ1RFmMwvDMB4ytsVYZ1pQ5ColVjF1ythBctH+pAqC9QTehFfe8jdqoow0QBLMWfGQzKSV5S8I8LG58J0drUiXRu+5j2zJq/OXnpMDC2s0kPP04trtJRlKaO4U/X2wFBc6MVZIbC5+QUI8VboRcKl+XAsiuTHlUUyPZo8nj1/7q3D+eGdDxHfZNhZI9Go1kOorS1HaiU7XHvwXk2KE7vL5lVAOpFdV4iFqQUu0EO+Fw3FC0jOJMDnb9z4yOLd2ZvgrMHt4RJfRbAHtvBdhOml9OvSrsL02XN5wgrfBBtm8uTR1dFPTzLiWfSVBIdPL3TZNN1m8fjm7AyX+H3+z1tzcFJ1igMhHlYkDtMIZap4PBheyB/EGrj4fZiBXE5XvUP+i2ZR8QL9PzniVhRGP9EioGDKPr3GNYy/fv/WbG6mg6WbFacRDo96IyHWe1sIEP7j+N7DXudhxFZCv+FW4AnxxQXUWysVImBYh7p9FG967SyqRgiz2mer3koBPIf/YOLq8hdM26F20q7UqZZXwJ+tgMYA/vPc45bUu7PocoMhiZFdGkoqIE6AL8XeanY4f3AA4b3o+x+yMZWFMMPUieBTG2bhOtgxNx/sN5FM3px1GiwQ+05Mp1rNcPWLk17vxAAEIb34wQlkWSVk8UIyh08JaF6wOjcYyOPiQycWgmja9dhKN3fbAlSskwgbCxiNlOWB2JnsELyi/kUvFQzfecci1OJTbI2zKkmTsqYNZMnuTTFNAbzG95thoRZ5VnN230gyhwiDF1xlz66zpJgmT5MWpnlWJqHFW+Lh6w0qzKg2JsRYGg/g8d7tcAqvuq930MPaIBl3HwvWTuKJwqeFUgtoy24PNU9oSDOkZ18PbWkCbxutKYAwLXx2PYSOuOjAxPqts9QuctUFoozrUwLatuN93e0nZ/FsZjwV972ZDa0NQnhbCgHuir3e9sM+vMk0P+jNbkSHCQv1sRbD9ROL0NMrfLDhBa+uwx8Q2bCIHF0sJt+jjoOJm5OdXu/cssb6wyuZCV/ga6jLnpiK7d5diW+W7J0nraIq29mEMadrRZlIDZbExOUHW+6tNfRzbBeKs++V4o16MeX0whVeLML13sH1DN4vB4RzGQCAxxTHUNbp8AYhiy3UZn+EXTlN0qSMCpS5YZX6NgZy3QGLx0AbP7+ECO7sr4/hs0RvtrdGC8HDh9MLXFgIX3KFF+gl43ZO9szbjeL4qlP2VLfYnsGIa7ahdDoBrezVEpoUZgDK6C38bbH4ehZuQpHo/NAPpIfCvFpzuH2p3hWHtzdm2tmXA9ExP6xZENL8qsYmUtVwMC7VzXaqAG0Yu6iuMLh4PIvMS4rk+GMTWw+FnqdQisv9e9sPnasYaDkbRh+U0UFu42YKbQwERtvPk6/VMydxQxMiHF8fVhdFngo30eQpVQzcQ6dhBAI3eQQBhRWiWxgI+2XrT9Ju/iPtpuaY3X5p8S7mDwWkC5SkbzyYswYaPqmKgTtZNWFMUtxLqMLABoDJ44ev0m6+eYlLwpONGKMOX3rze78cettSLx0cNq+iEzZMra/bMBQR2QaQRQDmTkQXkxcyL/ykVvVv25pzWH1Vr5WemCTqNZLrfrZ7PhKKNJoATDK2eAFbCWE3tO49M7+4Gj2JdraemubrdbxrWlLdcTTGldRtboxiOXk1URvyRPem82ncXMOPiGkTwPjGXmot9jjGcKsBVk184XIfIHgLvePQH5+cGocYF0b1Q3CsykAEaM7SHSBzffz7tB3Vfw0RiD4b8zjGsNxdPSHrVwDKXBBZmLbL6G8gHv2ILW0Z4YX2NwNMbA/AX3/T6j9IvI6Nid26o4bCzJ4rh5pFAOK3xjdQfycRYxjYRbWpbBxjZfMdgKE2VrJHjNKqnuuyEZGxtTIAAAnpSURBVBuYRny9T0adMJ17jMtewAGGq6ZNE8g7cOnjRODKfd18IcHlm0auhusjGFklbS5qAeL9WZdt2MT6crkvdk5Pl0dDcbglxg9XIpleLndGV2L+cLo8PRGjm7G4ujqeJ2JHLOXnUbelIRyucPhWb35cwRgMcaul+r0dyO0+oUwpYb/dzEwPtufiWqyAh+OL0VIM13Ykwvt1Ia7ub2YX4mZ1fjQSJ4fZCn+S0YxYtU5R1I0gNkPDNRvOqJ2QPPdYkVCW5Qy3PHbH7Q6uTCthB1c4vphtvZeNvr+/n4qro/1bsSaD6unxzsH96c2ezH4HB4di+2QpOXckdtbE6nZn3hGhZ/fNZmmmz9XMEoKxIqFgJSsA7eXKE9ZtOuDRlG+NtmXDt24H49XF+UojHO3e7hzv7Q6S+eWhGPd2B9OjUQn8E9u3y44IE88yGhapRuKQDMUILoSaXYY1xb4H0I6bYtfBxpEdmlBeZGI+QykV+9vr66eXD9vy47GU0rXRxWogxPJyKk5lviiW28dzOHHZm3aPSolqWTbqQ5l+2zBP1K6GfqyWRgBamYQPUD/oYg+GRzsjaWlW0tJcrgYDcbF83ztdXl3ORqPlmjhYjVa7UIi6KGGdEVjzSoyzrm8/qWZxso2Mz8ak0DNoWQFNJvzGbSGZivLsFdwAUtrImxdjIBAH0jOgt5gKeaOxGKrP6D6m8C0BL5HA9Hb5BEFqHB0hZiRB1QOeeiTK7J0HVXBqZyR7mgCqsZuO+8onxINGp8r/fEgENt9aVTtobfbPA6MK9ZqCWEXYepbBFtApAZjYIirXjiIlg+FNZF1VVj+rqtud6qmgG3obNmaajXkfYjk69wJL3rhyhgNINszWSqhdYfubGs4AtyH8cYjyIW4jIcuuzAzIJP4wDALUk4jwwQnNcrVLlPECM80OG+p/cEECSH4jiJ94IweE07o+MzDoBkCJW2O4Cy0nAJVjyHwltPvvVF1+ZXDZGagfR9jhlSxpJ0gMadhYmWkB0gcb7AJCAtBpKQZyNtkI13Y3F3itsgjzNoQNFa0uVi3HYQkDJNeVfD9SU03PKEB1tr0/fpI9oP7GalC2ldbtEoTNJR0WuZ2JM7tIcM7pptNG7gpfBdVGyRiWJzr8ZNZPGJ1Kdc2GR1iShWro+N+OMMZivb1vlxFp+SzuBs7MTsGUjWkaAZi4kQrVAqmEKuLmvNrnjg1mcnVue18ibCl5RG5o9DrG3wqBbKZOUoMBRoyyOctDgMQOGSVMtSuMtNftjWYQ2pN4O0IWCeWZvmMMffVk6TNyl/F4NRYMQjlTsWqujvAAhlFCLaNZjIWBkJIyByCsyydNd8RGrnWnRX+LUA6poTM47mOBDdezhZkFSHaFtkqozUy0RONKi8bQ9G1RQF4WIuTh30hp0mhnx6qeTIoyWpUwe0KCcHKeehxkKoeyD1J1C7PNNY9sJ0nSD8uV1PZhB4RxFFpWOla95IOyPjE4Gd4TgFmAOhxgnMqxajzKMvZPlkWeRxpoAt80Jwh5iDALT48WJzMjp90ql4ApJZIqTSVXO+j1KQcRINU0o4RGRtNIBYMImWm7VXsQh1qEzOYfMT6ZjmOxZ6rL/PN5ClMxyMlVgDIu55wO+ColZKl2hZKjQVN44sk0t4bGgpA/ZvUILZgYCOw5jnergRgGBDlsnOcGRAFgQQCC+QImOhDK4DBImQsto+FoFfzXrwgpwZTGEPLgg9NbSqrreFNxL4AoJRoQmQ6BJFi/NWsAgommg01GCfUZWViEUoytCKl0r/Ymsk8qDbTBGHdiGsXQV+kzqy9+VSqFaaFKNIiwClAqG6k1av2CAQEVqFZ2jlZpf1FB6FrEowhJSGeuiJkTHF8HUeb1xaFgnpNURqzSoMHh9p1n/TAMP1xzVaiBjkKZmayfRmSUdL+VPndihhFhyCAXllss8bd2sTlYW6mt0VaCXoTYV2XtAGDq1euNEgIL8XtWmfim41X73Y7euC4HhHmIkDlvaWsdcQigwrgvd1q7L3cSzqdk+Go+SKoPULKUU9ejfAYmjerhWRGyUNuZvCKkpMeLOEJ7hb04jQ65Yv8Bp3m/vg4djnFL4VZ7yfoApVaTaSVWCfEc/FSkYSmYKzQuNXSGJqMI0wpCJ1l95q6JtR41ENSn2r8NEDOEmDiA8ETMgelVpm6hXWGRV4yBsjNESM0D+ra1OKUzgtCeasOhmkoz9hZkm/Iu9bFN6E5VQSbxAKZ+cEWUUF0NyyzE/DZpGIlQdBqiEVauNFmqFy1U+kETzk+TGsQrk7foSRX0uULoAyQjOoWN1tRJ4PXDm6iQnAiXbixUfRKDENpdRWjDJhKi53FbI3sZ5LSPtZbaNKPqTsA6W4AZfqQPIEqIuBm8thhLEGiR36phoTU3q0OYOH1wgpPV2RJoAhh5Vr/VNkIMjkg/qgEWqCi+y+1bJdSH8xoWFlRI8UmomrlBmMlb8ypCohBOcvpxW8MUdFUMrFVFVjW2TL+lJpUYOokOXLM0s9GaNTMVFqpSgGugUkM42teqm6kieQRh4iJzl2dVTRn5AYJbnIzYBDHmMgEgKACdvEaVUBefaliYZHQkCk7N1IXKgULMLHsmiyE09TX5dPPY2HlIaGOkZMC/emsDpig2ZSaXj8i9mElH0iy1rhDEtRJU6dSfuHuujjLjOOHdeFhDJdJyZgZHAJeVzX5NIgh34Tj0Z6tF0dOyqrU1AP30hiihllFThgsAJtSAM1WRY6o9eICD/vYhVKggzF0tjiTLtZYEFBBjCzVo1gDR7yPglkwv/AyTKqGOuAFqmE/rxJGkWnhvQGji2BzFuwYhMTUuSK2TQa2AcN+IvtRDlI4f+9ubW2FMjhoKV0diLOT6JJdqoRpmSn8ZV8EndA6rWika65GIh/fjwWmi6u0wwI5VzfqpIACRdAAABAtNj2lfrGVUFZ8wAQ5YaFLjwlNDFEx5NMfTZWszjTB0AxCbk482SazTMhQpGL4tcKplfWwDUZhzjJABy7t7XOdahZyMJmhRY0m61yAsv4NgYvQDhyFqwIbFEGbOmLq4LxY42dsj68Bm5UE/hH1PNBXmgeWen9AhrFZCZ2aiLAyECpuWoqFJMeuTSs6Qh2kVIYSzvBoWgQhGAeqaOzSfc1tUqYeovUaBAGl/eEqYWhj9yig19kOeEiFFrmK2B+eDwYG5VUUdQnDPpm0p0cm0rnKIegMOEcv3PqurELVjhEsK6iR1+qRHMYhChoOxCnHfs6RchQ+qswFhoSLJlPUdBHcf9DOZfkRBxFRXEKuEJobDQmR5OEM9gGhfQZDM9EtLnhI6M1PDwoIKqVJDWEYLSl2IEGZXYR4aQ8jgRUH9dnzh7sPVubHJC+rG6FHQfVGx4CFENWvtfwHDaH1VhjSFBwAAAABJRU5ErkJggg=="
                                                        style={{ width: '50px' }}
                                                    />

                                                    <div>
                                                        <div className="text-xs text-gray-500">
                                                            <span class="bg-yellow-100 text-black-200 text-xs  me-2 px-2.5 py-0.5 rounded dark:bg-orange-150 dark:text-orange-500">
                                                                {typeFetch == 0}
                                                                {typeFetch == 1
                                                                    ? 'Chưa diễn ra'
                                                                    : typeFetch == 2
                                                                    ? 'Đang diễn ra'
                                                                    : 'Đã kết thúc'}
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold text-gray-800">{v.voucherName}</div>
                                                        <div className="text-xs text-gray-500">Mã voucher: {v.maVoucher}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">Theo {v.loaiVoucher == 1 ? '%' : 'Giá tiền'}</td>
                                            <td class="px-6 py-4">{v.soLuongSanPhamApDung} sản phẩm</td>
                                            <td class="px-6 py-4">
                                                {v.giaTriGiam}
                                                {v.loaiVoucher == 1 ? '%' : 'VND'}
                                            </td>
                                            <td class="px-6 py-4">{v.tongLuocDung}</td>
                                            <td class="px-6 py-4">{v.soLuocDaDung}</td>
                                            <td class="px-6 py-4">{v.soLuocDungMoiNguoi}</td>
                                            <td class="px-6 py-4">
                                                {new Date(v.ngayBatDau).toDateString()} - {new Date(v.ngayKetThuc).toDateString()}
                                            </td>
                                            <td class="px-6 py-4">
                                                <Link to={`/seller/updatevoucher/${v.id}`}>Cập nhật</Link>
                                                <Link to={`/seller/voucherinfo/${v.id}`}>Xem chi tiết</Link>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className=" border-gray-200 relative"></div>
            </div>
        </div>
    );
};
export default ListVoucher;

const VoucherReport=React.memo(()=>{

    const [report, setReport] = useState({
        sumary: 0,
        countOrder: 0,
        perUsed: 0,
        accountCount: 0,
    });
    const fetchReport=(e)=>{
        api.get(`/voucher/getreport?countday=${e}`)
            .then((v) => v.data)
            .then((v) => {
                setReport({
                    sumary: v[0],
                    countOrder: v[1],
                    perUsed: v[2],
                    accountCount: v[3],
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchReport(7)
    }, []);
    return <>
        Hiệu quả ({' '}
                    <small className="test-xs">
                        <select style={{ border: '0px solid red' }} onChange={(e) => fetchReport(e.target.value)}>
                            <option value="7">7 ngày trước</option>
                            <option value="30">30 ngày trước</option>
                            <option value="60">2 tháng trước</option>
                            <option value="18,262">tất cả</option>
                        </select>{' '}
                    </small>
                    )
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 text-xs">
                    <div class="border-r border-gray-300 p-4 rounded-lg shadow-sm">
                        <h2 class="text-sm font-semibold">Số tiền đa giảm</h2>
                        <p class="text-3xl font-bold">₫ {report.sumary}</p>
                        <p class="text-gray-500 ">
                            so với 7 ngày trước <span class="font-semibold">0.00%</span>
                        </p>
                    </div>

                    <div class="border-r border-gray-300 p-4 rounded-lg shadow-sm">
                        <h2 class="text-sm  font-semibold">Đơn Hàng</h2>
                        <p class="text-3xl font-bold">{report.countOrder}</p>
                        <p class="text-gray-500">
                            so với 7 ngày trước <span class="font-semibold">0.00%</span>
                        </p>
                    </div>

                    <div class="border-r border-gray-300 p-4 rounded-lg shadow-sm">
                        <h2 class="text-sm  font-semibold">Tỉ Lệ Sử Dụng</h2>
                        <p class="text-3xl font-bold">{report.perUsed}%</p>
                        <p class="text-gray-500">
                            so với 7 ngày trước <span class="font-semibold">0.00%</span>
                        </p>
                    </div>

                    <div class="border-r border-gray-300 p-4 rounded-lg shadow-sm">
                        <h2 class="text-sm  font-semibold">Người Mua</h2>
                        <p class="text-3xl font-bold">{report.accountCount}</p>
                        <p class="text-gray-500">
                            so với 7 ngày trước <span class="font-semibold">0.00%</span>
                        </p>
                    </div>
                </div>
    </>
})
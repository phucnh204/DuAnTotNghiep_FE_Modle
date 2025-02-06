import { useEffect, useState } from "react";
import api from "../../../config/APIUser";
import { useNavigate } from "react-router-dom";

const ListLive = ({changeLive,liveId}) => {
    useEffect(() => {
        api.get("/getalllive?id="+liveId)
            .then(v => v.data)
            .then(v => {
                setLive(v.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [lives, setLive] = useState([]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lives.map((v, index) => (
                <VideoCard changeLive={changeLive} key={index} live={v} />
            ))}
        </div>
    );
};

export default ListLive;

const VideoCard = ({ live,changeLive }) => {
    const navigate=useNavigate()
    return <>

    <div onClick={()=>{
        changeLive(live.id)
// navigate("/live/"+live.id)
    }} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
        <img
            src={live.hinhAnh}
            alt="Live thumbnail"
            className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">0 người xem</div>
        <div className="absolute top-2 right-2 bg-pink-500 text-white text-sm px-2 py-1 rounded">LIVE</div>
        <div className="p-4">
            <h3 className="text-lg font-semibold">{live.tieuDe}</h3>
            <p className="text-gray-400 text-sm">{live.shop.shopName}</p>
        </div>
    </div>
    </>
}
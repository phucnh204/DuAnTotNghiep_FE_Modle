import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Tooltip, Stack, Pagination, PaginationItem } from '@mui/material';
import { useEffect, useState, useRef, useContext } from 'react';
import api from '../../config/APIUser';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { BiCartAdd } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ModalChooseCart from './ModalChooseCart';
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from 'react-icons/io5';
import { AppContext } from '../../App';

const MyFavorite = () => {
  const [filter, setFilter] = useState({
    page: 0,
    numPage: 0,
    key: '',
  });
  const {setFloadingPage } = useContext(AppContext);

  const [fa, setFa] = useState([]);
  const [orderDetail,setOrder]=useState(null);
  const cardRefs = useRef([]); // Dùng để tham chiếu đến từng card

  const getMyFavorite = () => {
    setFloadingPage()
    api
      .get(`/myfavorite?page=${filter.page}&key=${filter.key}`)
      .then((v) => v.data)
      .then((v) => {
        filter.numPage= v.data.totalPages
        setFa(v.data.content);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getMyFavorite();
  }, []);

  const handleRemoveFavorite = (id,ids, index) => {
    const card = cardRefs.current[index];
    toast.promise(api.post("/favorite/delete?id="+id).then(v=>v.data).then(v=>{
      if(v.status!==200){
        throw new Error(v.message)
      }else{
        gsap.to(card, {
          scale: 0,
          duration: 0.2,
          onComplete: () => {
            setFa((prev) => prev.filter((item) => item.id !== id));
          },
        });
      }
    }),{
      loading:"Đang xử lý...",
      success:"Xóa thành công sản phẩm yêu thích",
      error:error=>error.message
    })
  };

  return (
    <div className="col-lg-10">
      <div className="card-profile">
        <div className="head-profile">
          <span className="fw-6 fs-18">Hồ Sơ Của Tôi</span>
          <p>Sản phẩm yêu thích</p>
        </div>
        <ModalChooseCart open={open} setOpen={setOpen} orderDetail={orderDetail}></ModalChooseCart>
        <Stack className='mt-2' spacing={4}>
        <Pagination
          onChange={(event, value) => {
            filter.page = value - 1;
            getMyFavorite()
          }}
          count={filter.numPage}
          renderItem={(item) => (
            <PaginationItem
              slots={{
                previous: IoArrowBackCircleOutline,
                next: IoArrowForwardCircleOutline,
              }}
              {...item}
            />
          )}
        />
      </Stack>
        <div className="body-profile mt-4">
          <div className="row">
            <div className="col-md-12">
              <Grid container spacing={3}>
                {fa.map((v, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={v.product.id}
                    ref={(el) => (cardRefs.current[index] = el)}
                  >
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        alt={v.product.tenSanPham}
                        sx={{
                          height: 270, // Chiều cao cố định của ảnh
                          objectFit: 'cover', // Giữ tỷ lệ của ảnh, cắt nếu cần
                        }}
                        image={v.product.hinhAnh}
                      />
                      <CardContent>
                      <Tooltip title={v.product.tenSanPham} placement="top" arrow>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            noWrap
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v.product.tenSanPham}
                          </Typography>
                        </Tooltip>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Shop <Link>{v.product.shop.shopName}</Link>
                        </Typography>
                      </CardContent>
                      <CardActions>
                          <Button sx={{ textTransform: 'none' }} size="small" onClick={() => handleRemoveFavorite(v.id,v.product.id, index)}>
                            Bỏ yêu thích
                          </Button>
                          <Button sx={{ textTransform: 'none' }} size="small">
                            <Link to={"/product/"+v.product.id}>Xem sản phẩm</Link>
                          </Button>
                          <BiCartAdd onClick={()=>{
                            setOrder(v)
                            setOpen(true)
                          }} color='yellow' cursor={"pointer"} size={20} />
                        </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFavorite;

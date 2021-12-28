import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Modal,
  Paper,
  Theme,
  createStyles,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Product } from 'models';
import React, { useState } from 'react';
import { numberWithCommas } from 'utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {},
    edit: {
      marginRight: theme.spacing(1),
    },
    modalImg: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paperImg: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    previewImg: {
      display: 'flex',
      width: '300px',
      height: '400px',
    },
    previewImg1: {
      display: 'flex',
      width: '600px',
      height: '400px',
    },
    img: {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
  })
);
export interface ProductTableProps {
  productList: Product[];
  onEdit?: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

export default function ProductTable({ productList, onEdit, onRemove }: ProductTableProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveClick = (product: Product): void => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const handleRemoveComfirm = (product: Product): void => {
    onRemove?.(product);
    setOpen(false);
  };
  const handleOpenImg = (product: Product) => {
    setImagePreview(product.imageInfo.map((item: any) => item['url']));
    setOpenImg(true);
  };

  const handleCloseImg = () => {
    setOpenImg(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Khuyến mãi</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell>Kích cỡ</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index}>
                <TableCell width={100}>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                {/* <TableCell>{capitalizeString(product.originalPrice)}</TableCell> */}
                <TableCell>{numberWithCommas(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {/* color={getMarkColor(product.price)} */}
                  <Box fontWeight="bold">{product.discount_percentage} </Box>
                </TableCell>
                <TableCell>{product.colorInfo.map((color) => color.name).join(', ')}</TableCell>
                <TableCell>{product.sizeInfo.map((size) => size.name).join(', ')}</TableCell>
                <TableCell>
                  <div className={classes.modalImg}>
                    <Button size="small" color="default" onClick={() => handleOpenImg(product)}>
                      Xem ảnh
                    </Button>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      className={classes.modalImg}
                      open={openImg}
                      onClose={handleCloseImg}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                        style: { backgroundColor: 'transparent' },
                      }}
                    >
                      <Fade in={openImg}>
                        <div className={classes.paperImg}>
                          {imagePreview[1] ? (
                            <div className={classes.previewImg1}>
                              <img src={imagePreview[0]} alt="" className={classes.img} />
                              {imagePreview[1] && (
                                <img src={imagePreview[1]} alt="" className={classes.img} />
                              )}
                            </div>
                          ) : (
                            <div className={classes.previewImg}>
                              <img src={imagePreview[0]} alt="" className={classes.img} />
                              {imagePreview[1] && (
                                <img src={imagePreview[1]} alt="" className={classes.img} />
                              )}
                            </div>
                          )}
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Button
                    className={classes.edit}
                    size="small"
                    color="primary"
                    onClick={() => {
                      onEdit?.(product);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      handleRemoveClick(product);
                    }}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Remove Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa sản phẩm?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có thực sự muốn xóa sản phẩm "{selectedProduct?.name}" ? <br />
            Việc này không thể quay lại!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={() => handleRemoveComfirm(selectedProduct as Product)}
            color="secondary"
            variant="contained"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

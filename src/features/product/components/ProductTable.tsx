import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
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

const useStyles = makeStyles((theme) => ({
  table: {},
  edit: {
    marginRight: theme.spacing(1),
  },
}));
export interface StudentTableProps {
  productList: Product[];
  onEdit?: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

export default function ProductTable({
  productList,
  onEdit,
  onRemove,
}: StudentTableProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

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
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người tạo</TableCell>

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
                <TableCell>{product.status ? 'Mới nhập' : 'Tồn kho'}</TableCell>
                <TableCell>{product.createdBy}</TableCell>
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

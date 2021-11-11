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
import { City, Product } from 'models';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  table: {},
  edit: {
    marginRight: theme.spacing(1),
  },
}));
export interface StudentTableProps {
  productList: Product[];
  cityMap: {
    [key: string]: City;
  };
  onEdit?: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

export default function StudentTable({
  productList,
  cityMap,
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
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Amount</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index}>
                <TableCell width={310}>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                {/* <TableCell>{capitalizeString(product.originalPrice)}</TableCell> */}
                <TableCell>{product.originalPrice}</TableCell>
                <TableCell>
                  {/* color={getMarkColor(product.price)} */}
                  <Box fontWeight="bold">{product.salePrice} </Box>
                </TableCell>
                {/* <TableCell>{cityMap[product.city]?.name}</TableCell> */}
                <TableCell align="right">
                  <Button
                    className={classes.edit}
                    size="small"
                    color="primary"
                    onClick={() => {
                      onEdit?.(product);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      handleRemoveClick(product);
                    }}
                  >
                    Remove
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
        <DialogTitle id="alert-dialog-title">Remove a product?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this product has name "{selectedProduct?.name}" ? <br />
            This action can&apos;t be undo!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleRemoveComfirm(selectedProduct as Product)}
            color="secondary"
            variant="contained"
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

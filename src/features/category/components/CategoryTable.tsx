import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import dayjs from 'dayjs';
import { Category } from 'models';
import React, { useState } from 'react';


const useStyles = makeStyles((theme) => ({
  table: {},
  edit: {
    marginRight: theme.spacing(1),
  },
}));
export interface CategoryTableProps {
  categoryList: Category[];
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
}

export default function CategoryTable({ categoryList, onEdit, onRemove }: CategoryTableProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveClick = (category: Category): void => {
    setSelectedCategory(category);
    setOpen(true);
  };
  const handleRemoveComfirm = (category: Category): void => {
    onRemove?.(category);
    setOpen(false);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>slug</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Danh mục cha</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryList.map((category, index) => (
              <TableRow key={index}>
                <TableCell width={100}>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.status ? 'Kích hoạt' : 'Ẩn'}</TableCell>
                <TableCell>{category.createdBy}</TableCell>
                <TableCell>{dayjs(category.createdAt).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{category.parentId}</TableCell>
                <TableCell align="right">
                  <Button
                    className={classes.edit}
                    size="small"
                    color="primary"
                    onClick={() => {
                      onEdit?.(category);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      handleRemoveClick(category);
                    }}
                  >
                    Ẩn
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
        <DialogTitle id="alert-dialog-title">Ẩn danh mục?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn muốn ẩn danh mục này ? <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={() => handleRemoveComfirm(selectedCategory as Category)}
            color="secondary"
            variant="contained"
            autoFocus
          >
            Ẩn
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

import { Box, Button, Typography } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import categoryApi from 'api/categoryApi';
import { Category } from 'models';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CategoryForm from '../components/CategoryForm';


export default function AddEditPage() {
  const history = useHistory();
  const { categoryId } = useParams<{ categoryId: string }>();
  const isEdit = Boolean(categoryId);
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      try {
        const response = await categoryApi.getById(Number(categoryId));
        setCategory(response.data);
      } catch (error) {
        console.log('failed to fetch product', error);
      }
    })();
  }, [categoryId]);
  const handleCategoryFormSubmit = async (formValues: Category) => {
    if (isEdit) {
      await categoryApi.update(formValues);
    } else {
      await categoryApi.add(formValues);
    }
    toast.success('thành công!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    history.push('/admin/category');
  };
  const initialValues: Category = {
    name: '',
    status: 1,
    ...category,
  } as Category;
  return (
    <Box>
      <Link to="/admin/category">
        <Button variant="contained" color="primary">
          <ChevronLeft /> Quay lại
        </Button>
      </Link>

      <Box mt={4}>
        <Typography variant="h4">{isEdit ? `Cập nhật danh mục ` : 'Thêm danh mục'}</Typography>
      </Box>
      {(!isEdit || Boolean(category)) && (
        <Box mt={4}>
          <CategoryForm initialValues={initialValues} onSubmit={handleCategoryFormSubmit} />
        </Box>
      )}
    </Box>
  );
}

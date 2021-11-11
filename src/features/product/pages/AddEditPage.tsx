import { Box, Button, Typography } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import productApi from 'api/productApi';
import { Product } from 'models';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductForm from '../components/ProductForm';

export default function AddEditPage() {
  const history = useHistory();
  const { productId } = useParams<{ productId: string }>();
  const isEdit = Boolean(productId);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const response = await productApi.getById(Number(productId));
        setProduct(response);
      } catch (error) {
        console.log('failed to fetch product', error);
      }
    })();
  }, [productId]);
  const handleProductFormSubmit = async (formValues: Product) => {
    if (isEdit) {
      await productApi.update(formValues);
    } else {
      await productApi.add(formValues);
    }

    toast.success('Save product successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    history.push('/admin/product');
  };

  const initialValues: Product = {
    name: '',
    price: 0,
    amount: 0,
    status: 1,
    description: '',
    size: 'm',
    city: '',
    ...product,
  } as Product;
  return (
    <Box>
      <Link to="/admin/product">
        <Button variant="contained" color="primary">
          <ChevronLeft /> Back
        </Button>
      </Link>

      <Box mt={4}>
        <Typography variant="h4">{isEdit ? `Update product ` : 'Add new product'}</Typography>
      </Box>
      {(!isEdit || Boolean(product)) && (
        <Box mt={4}>
          <ProductForm initialValues={initialValues} onSubmit={handleProductFormSubmit} />
        </Box>
      )}
    </Box>
  );
}

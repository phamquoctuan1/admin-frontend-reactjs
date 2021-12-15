import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button, CircularProgress, FormControl, Grid, MenuItem, Select, Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import categoryApi from 'api/categoryApi';
import { useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import { InputField } from 'components/FormFields';
import { selectUser } from 'features/auth/authSlice';
import { Category, Product } from 'models';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
export interface CategoryFormProps {
  initialValues: Category;
  onSubmit: (formValues: Category) => void;
}
const schema = yup
  .object({
    name: yup.string().required('Nhập tên danh mục'),
  })
  .required();

export default function CategoryForm({ initialValues, onSubmit }: CategoryFormProps) {
  const [error, setError] = useState<string>('');
  const user = useAppSelector(selectUser);
  const [categoryData, setCategoryData] = useState<Category>(initialValues);
  const [category, setCategory] = useState<Category[]>();
  const [valueSelect, setValueSelect] = useState();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Product>({
    defaultValues:initialValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, []);
      const handleSelectChange = (e: any) => {
        setCategoryData({ ...categoryData,parentId: e.target.value});
        setValueSelect(e.target.value);
      };
  const handleFormSubmit = async (formValues: Category) => {
     formValues = { ...categoryData };  
      console.log(formValues);
    try {
      setError('');
      await onSubmit?.(formValues);
    } catch (error) {
         let msg = (error as AxiosError).response?.data.message;
       setError(msg);
    }
  };
  return (
    <Box maxWidth={1}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl variant="outlined" size="small">
              <InputField
                name="name"
                control={control}
                label="Tên danh mục"
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value, createdBy: user?.name })
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Grid container direction="column">
              <Grid item xs={12} md={6} lg={4}>
                <Typography id="Category">Danh mục cha </Typography>
              </Grid>
              <Box style={{ height: '40px' }}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Select
                    labelId="Category"
                    label="Danh mục cha"
                    value={valueSelect || categoryData.parentId}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={initialValues?.id}></MenuItem>
                    {category?.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting && <CircularProgress size={16} color="primary" />} Lưu
          </Button>
        </Box>
      </form>
    </Box>
  );
}

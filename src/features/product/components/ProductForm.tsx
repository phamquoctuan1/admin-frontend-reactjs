import { yupResolver } from '@hookform/resolvers/yup';
import {
  Backdrop, Box,
  Button,
  Checkbox,
  CircularProgress, createStyles, Fade,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Select,
  TextField,
  Theme,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import categoryApi from 'api/categoryApi';
import { useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import { InputField } from 'components/FormFields';
import { colors } from 'constants/colors';
import { sizes } from 'constants/sizes';
import { selectUser } from 'features/auth/authSlice';
import { Category, Color, Product, Size } from 'models';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
export interface ProductFormProps {
  initialValues?: Product;
  onSubmit?: (formValues: Product) => void;
}
const schema = yup
  .object({
    name: yup.string().required('Nhập tên sản phẩm'),
    price: yup
      .number()
      .positive('Giá sản phẩm không được âm.')
      .integer('Giá sản phẩm không được âm')
      .required('Không được bỏ trống')
      .typeError('Giá trị không hợp lệ')
      .min(10000,'Tối thiểu 10 ngàn đồng'),
    quantity: yup
      .number()
      .positive('Giá sản phẩm không được âm.')
      .integer('Giá sản phẩm không được âm')
      .required('Không được bỏ trống')
      .typeError('Giá trị không hợp lệ'),
    discount_percentage: yup.string()
      .matches(
      /^0*(100\.00|0|100|[0-9]?[0-9])%+?$/,
        'Nhập khuyến mãi theo %'
      )
  })
  .required();
  const initialDataProduct: Product = {
    description: '',
    imageInfo: [],
    sizeInfo: [],
    colorInfo: [],
    status: true,
    categoryId: 0,
    createdBy: '',
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
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
export default function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const classes = useStyles();
  const [error, setError] = useState<string>('');
  const [dataProduct, setDataProduct] = useState(initialDataProduct);
  const user = useAppSelector(selectUser);
 
  useEffect(() => {
    if (initialValues?.id) {
      setDataProduct(initialValues);
    }
  }, [initialValues]);
  let a: string[] = [];
  if (initialValues?.imageInfo) a = initialValues?.imageInfo.map((item: any) => item['url']);
  const [imagePreview, setImagePreview] = useState<string[]>(a || []);
const [category, setCategory] = useState<Category[]>();
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
 
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
 const handleOnchangeColor = (value: Color) => {
   const currentIdx: number = dataProduct?.colorInfo.findIndex((item) => item.name === value.name);
   const newColor = [...dataProduct.colorInfo];
   if (currentIdx === -1) {
     newColor.push(value);
   } else {
     newColor.splice(currentIdx, 1);
   }
   setDataProduct({ ...dataProduct, colorInfo: newColor });
 };
  const handleOnchangeSize = (value: Size) => {
    const currentIdx: number = dataProduct?.sizeInfo.findIndex(item=>item.name===value.name);
    const newSize = [...dataProduct.sizeInfo];
    if (currentIdx === -1) {
      newSize.push(value);
    } else {
      newSize.splice(currentIdx, 1);
    }
    setDataProduct({ ...dataProduct, sizeInfo: newSize });
  };
const handleSelectChange = (e: any) => {
  setDataProduct({ ...dataProduct, categoryId: e.target.value });
}
// const handleTextAreaChange = (newContent:string) => {
//    return setDataProduct({ ...dataProduct, description: newContent });
// };
const onChangeQuantity = (e: any) => {
  const quantity = e.target.value;
  setDataProduct({ ...dataProduct, quantity: parseInt(quantity) });
};
const onChangePrice = (e: any) => {
  const price = e.target.value;
  setDataProduct({ ...dataProduct, price: parseInt(price) });
};

const handleImageChange= (e:any)=>{
    setError('');
   let files = e.target.files;
    let allFiles : any = [];
    let filePreview : any = [];
    if (files.length > 2){
      setError('Tối đa chỉ nhận 2 ảnh');
      return
    }
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      filePreview.push(URL.createObjectURL(file))
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        allFiles.push(reader.result);
    }
  }setDataProduct({...dataProduct,imageInfo:allFiles,createdBy:user.name})
  setImagePreview(filePreview);
}
  const handleFormSubmit = async (formValues: Product) => {
   formValues = {
     ...dataProduct,
   };
    try {
      setError('');
      await onSubmit?.(formValues);
    } catch (err) {
       let msg = (err as AxiosError).response?.data.message;
       setError(msg);
    }
  };
  return (
    <Box maxWidth={1}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="outlined" size="small">
                  <InputField
                    name="name"
                    control={control}
                    label="Tên sản phẩm"
                    onChange={(e) =>
                      setDataProduct({ ...dataProduct, name: e.target.value })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="outlined" size="small">
                  <InputField
                    name="price"
                    control={control}
                    label="Giá"
                    type="number"
                    min="10000"
                    onChange={onChangePrice}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="outlined" size="small">
                  <InputField
                    name="quantity"
                    control={control}
                    label="Số lượng"
                    type="number"
                    min="0"
                    onChange={onChangeQuantity}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="outlined" size="small">
                  <InputField name="discount_percentage" control={control} label="Giảm giá %" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                <FormControl variant="standard" size="small" fullWidth>
                  <InputField
                    name="image[]"
                    control={control}
                    type="file"
                    multiple
                    required={initialValues?.id ? false : true}
                    onChange={handleImageChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} md={6} lg={4}>
                <Box style={{ height: '40px', width: '210.4px', marginTop: '16px' }}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="Category"> Danh mục</InputLabel>
                    <Select
                      labelId="Category"
                      label="Danh mục"
                      value={initialValues?.categoryId}
                      onChange={handleSelectChange}
                      defaultValue={initialValues?.categoryId}
                      displayEmpty
                    >
                      <MenuItem value={initialValues?.categoryId}></MenuItem>
                      {category?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              {imagePreview.length > 0 && (
                <Grid item xs={12} md={6} lg={4}>
                  <div>
                    <button type="button" onClick={handleOpen}>
                      Xem ảnh
                    </button>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      className={classes.modal}
                      open={open}
                      onClose={handleClose}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={open}>
                        <div className={classes.paper}>
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
                </Grid>
              )}{' '}
            </Grid>
            <Box mt={2}>
              <Grid item xs={12} md={12} lg={11}>
                <Typography variant="h6" component="h3">
                  Mô tả
                </Typography>
                {/* <JoditEditor
                  ref={editor}
                  value={dataProduct.description as string}
                  // config={config}
                  // tabIndex of textarea
                  onChange={handleTextAreaChange}
                /> */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  defaultValue={initialValues?.description}
                  variant="outlined"
                  onChange={(e) => setDataProduct({ ...dataProduct, description: e.target.value })}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl>
              <Typography variant="h6" component="h3">
                Màu sắc
              </Typography>
              {colors.map((item: any, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      name={item.name}
                      onChange={() => handleOnchangeColor(item)}
                      checked={
                        dataProduct.colorInfo.findIndex((i) => i.name === item.name) === -1
                          ? false
                          : true
                      }
                    />
                  }
                  label={item.name}
                />
              ))}
            </FormControl>

            <FormControl style={{ marginLeft: '60px' }}>
              <Typography variant="h6" component="h3">
                Kích cỡ
              </Typography>
              {sizes.map((item: any, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      name={item.name}
                      onChange={() => handleOnchangeSize(item)}
                      checked={
                        dataProduct.sizeInfo.findIndex((i) => i.name === item.name) === -1
                          ? false
                          : true
                      }
                    />
                  }
                  label={item.name}
                />
              ))}
            </FormControl>
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

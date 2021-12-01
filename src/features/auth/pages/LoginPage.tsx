import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Container, makeStyles, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useAppDispatch } from 'app/hooks';
import { InputField } from 'components/FormFields';
import { User } from 'models';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { authActions, LoginPayload } from '../authSlice';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup
  .object({
    userName: yup.string().required('Không thể bỏ trống'),
    password: yup
      .string()
      .min(8, 'Mật khẩu phải trên 8 ký tự')
      .required('Mật khẩu không thể bỏ trống'),
  })
  .required();
export default function LoginPage() {
  const initialValues = {
    userName:'',
    password:'',
  };
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<User>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleFormSubmit = (formValues: LoginPayload) => {
    dispatch(authActions.login(formValues));
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập trang quản trị
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} className={classes.form} noValidate>
          <InputField name="userName" control={control} label="Tên đăng nhập" />
          <InputField name="password" control={control} label="Mật khẩu" type="password" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
}

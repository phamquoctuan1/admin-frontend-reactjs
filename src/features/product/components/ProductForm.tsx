import { Box, Button, CircularProgress } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import { InputField, RadioGroupField, SelectField } from 'components/FormFields';
import { selectCityOptions } from 'features/city/citySlice';
import { Product } from 'models';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert } from '@material-ui/lab';

export interface ProductFormProps {
  initialValues?: Product;
  onSubmit?: (formValues: Product) => void;
}
const schema = yup
  .object({
    name: yup.string().required('Please enter name'),
    price: yup
      .number()
      .positive('Please enter a positive number.')
      .integer('Please enter an integer')
      .min(0, 'Min is 0')
      .required('Please enter a age')
      .typeError('Please enter a valid number'),
    amount: yup.number().min(0, 'Min is 0').required().typeError('Please enter a valid number'),
    city: yup.string().required('Please select city'),
  })
  .required();
export default function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const [error, setError] = useState<string>('');
  const cityOptions = useAppSelector(selectCityOptions);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Product>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (formValues: Product) => {
    try {
      setError('');
      await onSubmit?.(formValues);
    } catch (err) {
      let msg = (err as Error).message;
      setError(msg);
    }
  };

  return (
    <Box maxWidth={350}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <InputField name="name" control={control} label="Product Name" />
        <RadioGroupField
          name="size"
          control={control}
          label="Size"
          options={[
            { label: 'M', value: 'm' },
            { label: 'S', value: 's' },
            { label: 'L', value: 'l' },
            { label: 'XL', value: 'xl' },
          ]}
        />
        <InputField name="price" control={control} label="Price" type="number" />
        <InputField name="amount" control={control} label="Amount" type="number" />
        {Array.isArray(cityOptions) && cityOptions.length > 0 && (
          <SelectField name="city" control={control} label="City" options={cityOptions} />
        )}

        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting && <CircularProgress size={16} color="primary" />} Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}

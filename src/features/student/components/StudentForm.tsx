import { Box, Button, CircularProgress } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import { InputField, RadioGroupField, SelectField } from 'components/FormFields';
import { selectCityOptions } from 'features/city/citySlice';
import { Student } from 'models';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert } from '@material-ui/lab';

export interface StudentFormProps {
  initialValues?: Student;
  onSubmit?: (formValues: Student) => void;
}
const schema = yup
  .object({
    name: yup.string().required('Please enter name'),
    age: yup
      .number()
      .positive('Please enter a positive number.')
      .integer('Please enter an integer')
      .required('Please enter a age')
      .min(18, 'Min is 18')
      .max(150)
      .typeError('Please enter a valid number'),
    mark: yup
      .number()
      .min(0, 'Min is 0')
      .max(10, 'Max is 10')
      .required()
      .typeError('Please enter a valid number'),
    gender: yup
      .string()
      .oneOf(['male', 'female'], 'Please check either male or female')
      .required('Please select  gender'),
    city: yup.string().required('Please select city'),
  })
  .required();
export default function StudentForm({ initialValues, onSubmit }: StudentFormProps) {
  const [error, setError] = useState<string>('');
  const cityOptions = useAppSelector(selectCityOptions);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Student>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (formValues: Student) => {
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
        <InputField name="name" control={control} label="Full Name" />
        <RadioGroupField
          name="gender"
          control={control}
          label="Gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
        />
        <InputField name="age" control={control} label="Age" type="number" />
        <InputField name="mark" control={control} label="Mark" type="number" />
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

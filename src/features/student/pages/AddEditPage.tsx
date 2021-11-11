import { Box, Button, Typography } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import studentApi from 'api/studentApi';
import { Student } from 'models';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentForm from '../components/StudentForm';

export default function AddEditPage() {
  const history = useHistory();
  const { studentId } = useParams<{ studentId: string }>();
  const isEdit = Boolean(studentId);
  const [student, setStudent] = useState<Student>();

  useEffect(() => {
    if (!studentId) return;
    (async () => {
      try {
        const response = await studentApi.getById(studentId);
        setStudent(response);
      } catch (error) {
        console.log('failed to fetch student', error);
      }
    })();
  }, [studentId]);
  const handleStudentFormSubmit = async (formValues: Student) => {
    if (isEdit) {
      await studentApi.update(formValues);
    } else {
      await studentApi.add(formValues);
    }

    toast.success('Save student successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    history.push('/admin/student');
  };

  const initialValues: Student = {
    name: '',
    age: '',
    gender: 'male',
    mark: '',
    city: '',
    ...student,
  } as Student;
  return (
    <Box>
      <Link to="/admin/student">
        <Button variant="contained" color="primary">
          <ChevronLeft /> Back
        </Button>
      </Link>

      <Box mt={4}>
        <Typography variant="h4">{isEdit ? `Update student ` : 'Add new student'}</Typography>
      </Box>
      {(!isEdit || Boolean(student)) && (
        <Box mt={4}>
          <StudentForm initialValues={initialValues} onSubmit={handleStudentFormSubmit} />
        </Box>
      )}
    </Box>
  );
}

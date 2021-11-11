import * as React from 'react';
import { Redirect } from 'react-router-dom';

export function NotFound() {
  return <Redirect to="/admin" />;
}

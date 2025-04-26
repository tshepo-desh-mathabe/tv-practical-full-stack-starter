'use client';
import { ReactNode } from 'react';

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white'>
      <h2 className='display-4 fw-bold mb-4'>Fibertime TV Connect</h2>
      {children}
    </div>
  );
};
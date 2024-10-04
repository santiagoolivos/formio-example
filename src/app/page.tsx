'use client';
import { Form } from '@formio/react';

export default function Home() {


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Embedded Form</h1>
      <div className='w-full p-10'>
        <div className="w-full min-h-96 p-6  bg-white rounded shadow-md">
          <Form src="https://ttfkzplronqfglo.form.io/exampleformi9" />
        </div>
      </div>
    </div>
  );
}

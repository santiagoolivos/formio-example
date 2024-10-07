'use client';
import { Form } from '@formio/react';
import { useState } from 'react';

export default function Home() {
  const [submission, setSubmission] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  const onSubmitDone = (submission:any) => {
    setSubmission(submission.data);
    setSubmissionId(submission._id);
  }

  const handleDownload = async () => {
    if (!submissionId) return;

    const downloadUrl = `https://ttfkzplronqfglo.form.io/exampleformi9/submission/${submissionId}/download?`;
    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'x-jwt-token': process.env.NEXT_PUBLIC_FORMIO_JWT || '',
        },
      });
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      console.log('Download URL:', url);

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      console.log('Download URL:', link.href);
      link.setAttribute('download', `submission_${submissionId}.pdf`); // Adjust file type if necessary
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Embedded Form</h1>
      <div className='w-full p-10'>
        <div className="w-full min-h-96 p-6  bg-white rounded shadow-md">
          <Form src="https://ttfkzplronqfglo.form.io/exampleformi9" onSubmitDone={onSubmitDone} />
        </div>
      </div>
      {submission && (
        <div className="w-full p-10">
          <h2 className="text-2xl font-bold mb-4">Submission: {submissionId}</h2>
          <button
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleDownload}
          >
            Download
          </button>
          <pre>{JSON.stringify(submission, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

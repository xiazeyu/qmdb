import React from 'react';

import { useParams } from 'react-router-dom';
import usePeople from '../api/people';

function People() {
  const { id } = useParams();

  const { data, isLoading, isError } = usePeople(id, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pa2VAZ21haWwuY29tIiwiZXhwIjoxNzE1NTA4NzI1LCJpYXQiOjE2ODM5NzI3MjV9.fFZ4TkD8hGGfIyo_MmYi4TsC1DLJyY3K1EMB0gTFD4w');

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div>
        Error:
        {JSON.stringify(isError.message)}
      </div>
    );
  }
  return (
    <div>
      Success:
      {JSON.stringify(data)}
    </div>
  );
}

export default People;

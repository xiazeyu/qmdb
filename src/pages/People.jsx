import React from 'react';
import {
  Descriptions, Result, Button, Skeleton, Grid, Image, List, Table,
} from '@arco-design/web-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { useParams } from 'react-router-dom';
import usePeople from '../api/people';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function People() {
  const { id } = useParams();

  const { data, isLoading, isError } = usePeople(id, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pa2VAZ21haWwuY29tIiwiZXhwIjoxNzE1NTA4NzI1LCJpYXQiOjE2ODM5NzI3MjV9.fFZ4TkD8hGGfIyo_MmYi4TsC1DLJyY3K1EMB0gTFD4w');

  if (isLoading) return <div><Skeleton animation text={{ rows: 10 }} /></div>;
  if (isError) {
    return (
      <div>
        <Result
          status="error"
          title={isError.message}
          extra={<Button onClick={() => { location.reload(); }} type="primary">Retry</Button>}
        />
      </div>
    );
  }

  const columns = [
    {
      title: 'Role',
      dataIndex: 'category',
    },
    {
      title: 'Name',
      dataIndex: 'movieName',
    },
    {
      title: 'Characters',
      dataIndex: 'joinedCharacters',
    },
    {
      title: 'IMDB Rating',
      dataIndex: 'imdbRating',
    },
  ];

  const rolesData = data.roles.map((item) => {
    const joinedCharacters = item.characters.join(', ');
    return { ...item, joinedCharacters };
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `IMDB Rating for ${data.name}`,
      },
    },
  };

  const ratingData = data.roles.map((item) => item.imdbRating);
  const counts = Array(10).fill(0);

  ratingData.forEach((num) => {
    const roundedNumber = Math.ceil(num);
    if (roundedNumber === 0) {
      counts[0]++;
    }
    if (roundedNumber >= 1 && roundedNumber <= 9) {
      counts[roundedNumber - 1]++;
    }
  });
  console.log(counts);

  const labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'IMDB Rating',
        data: counts,
        backgroundColor: 'rgba(118, 160, 248, 0.7)',
      },
    ],
  };

  return (
    <div>
      <h1>{data.name}</h1>
      <h3>
        {data.birthYear || ''}
        {' '}
        —
        {' '}
        {data.deathYear || ''}
      </h3>
      <Table columns={columns} data={rolesData} />
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default People;

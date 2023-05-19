import React, { useContext } from 'react';
import {
  Result, Button, Skeleton, Table,
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

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import usePeople from '../api/people';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function People() {
  const navigate = useNavigate();
  const location = useLocation();

  const { accessToken } = useContext(AuthContext);

  const { id } = useParams();

  const { data, isLoading, isError } = usePeople(id, accessToken);

  if (isLoading) return <div><Skeleton animation text={{ rows: 10 }} /></div>;
  if (!accessToken) {
    return (
      <div>
        <Result
          status="error"
          title="You are not logged in"
          extra={<Button onClick={() => navigate('/auth/login', { state: { from: location } })} type="primary">Login</Button>}
        />
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <Result
          status="error"
          title={isError.message}
          extra={<Button onClick={() => { window.location.reload(); }} type="primary">Retry</Button>}
        />
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <Result
          status="error"
          title="Something is wrong."
          extra={<Button onClick={() => { window.location.reload(); }} type="primary">Retry</Button>}
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
      counts[0] += 1;
    }
    if (roundedNumber >= 1 && roundedNumber <= 9) {
      counts[roundedNumber - 1] += 1;
    }
  });

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
      <Table
        columns={columns}
        data={rolesData}
        onRow={(record) => ({
          onClick: () => navigate(`/movie/${record.movieId}`),
        })}
      />
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default People;

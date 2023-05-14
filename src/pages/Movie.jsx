import React from 'react';

import {
  Descriptions, Result, Button, Skeleton, Grid, Image, List, Table,
} from '@arco-design/web-react';

import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '../api/movies';

const { Row, Col } = Grid;

function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useMovie(id);

  if (isLoading) return <div><Skeleton animation text={{ rows: 10 }} /></div>;
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

  const desdata = [
    {
      label: 'Release Year',
      value: data.year,
    },
    {
      label: 'Run Time',
      value: data.runtime,
    },
    {
      label: 'Genres',
      value: data.genres.join(', '),
    },
    {
      label: 'Country',
      value: data.country,
    },
    {
      label: 'Box Office',
      value: `$${data.boxoffice}`,
    },
    {
      label: 'Plot',
      value: data.plot,
    },
  ];

  const columns = [
    {
      title: 'Role',
      dataIndex: 'category',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Characters',
      dataIndex: 'joinedCharacters',
    },
  ];

  const ratingData = data.ratings.map((item) => {
    const joinedRatings = `${item.source}: ${item.value}`;
    return { ...item, joinedRatings };
  });

  const principalsData = data.principals.map((item) => {
    const joinedCharacters = item.characters.join(', ');
    return { ...item, joinedCharacters };
  });

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Descriptions border title={data.title} data={desdata} column={1} />
        </Col>
        <Col span={8}>
          <Image src={data.poster} alt="Poster" width={250} />
        </Col>
        <Col span={8}>
          <List header="Ratings" dataSource={ratingData} render={(item, index) => <List.Item key={index}>{item.joinedRatings}</List.Item>} />
        </Col>
        <Col span={16}>
          Click on principals to see their details.
          <Table
            columns={columns}
            data={principalsData}
            onRow={(record) => ({
              onClick: () => navigate(`/people/${record.id}`),
            })}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Movie;

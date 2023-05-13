import React from 'react';

import { Descriptions, Result, Button, Skeleton, Grid } from '@arco-design/web-react';

import { useParams } from 'react-router-dom';
import { useMovie } from '../api/movies';

const {Row, Col} = Grid;

function Movie() {
  const { id } = useParams();

  const { data, isLoading, isError } = useMovie(id);

  if (isLoading) return <div><Skeleton animation text={{rows: 10}} /></div>;
  if (isError) {
    return (
      <div>
        <Result
          status='error'
          title={isError.message}
          extra={<Button onClick={() => { location.reload() }} type='primary'>Retry</Button>}
        ></Result>
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
      label: 'Address',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ];
  
  const columns = [
    {
      title: 'Category',
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

  const ratingData = data.ratings.map(item => {
    const joinedRatings = `${item.source} ${item.value}`;
    return { ...item, joinedRatings };
  })

  const tblData = data.principals.map(item => {
    const joinedCharacters = item.characters.join(', ');
    return { ...item, characters: joinedCharacters };
  });

  return (
    <div>
      <Col span={16}>
      <Descriptions border title={data.title} data={desdata} />
        </Col>
    </div>
  );
}

export default Movie;

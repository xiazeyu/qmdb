import { React, useState, useRef, useEffect } from 'react';
import { Table, TableColumnProps, Space, Input, Button, Skeleton, Result } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

import { useMovies } from '../api/movies';

function Movie() {
  let navigate = useNavigate();
  const titleInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const titleFilter = useState(undefined);
  const yearFilter = useState(undefined);

  const { data, isLoading, isError } = useMovies();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
        return (
          <div className='arco-table-custom-filter'>
            <Input.Search
              ref={titleInputRef}
              searchButton
              placeholder='Please enter name'
              value={filterKeys[0] || ''}
              onChange={(value) => {
                setFilterKeys(value ? [value] : []);
              }}
              onSearch={() => {
                confirm();
              }}
            />
          </div>
        );
      },
      onFilter: (value, row) => {
        console.log(value, row)
        return value ? row.title.indexOf(value) !== -1 : true
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => titleInputRef.current.focus(), 150);
        }
      },
    },
    {
      title: 'Year',
      dataIndex: 'year',
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
        return (
          <div className='arco-table-custom-filter'>
            <Input.Search
              ref={yearInputRef}
              searchButton
              placeholder='Please enter name'
              value={filterKeys[0] || ''}
              onChange={(value) => {
                setFilterKeys(value ? [value] : []);
              }}
              onSearch={() => {
                confirm();
              }}
            />
          </div>
        );
      },
      onFilter: (value, row) => {
        console.log(value, row)
        return value ? row.year == value : true
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => yearInputRef.current.focus(), 150);
        }
      },
    },
    {
      title: 'IMDB Rating',
      dataIndex: 'imdbRating',
    },
    {
      title: 'Rotten Tomatoes Rating',
      dataIndex: 'rottenTomatoesRating',
    },
    {
      title: 'Metacritic Rating',
      dataIndex: 'metacriticRating',
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
    },
  ];

  if (isLoading) return <Table columns={columns} loading />

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
  return (
    <div>
      <h2>Click the row to see your movie details.</h2>
      <Table columns={columns} data={data.data} onRow={(record, index) => {
        return {
          onClick: () => navigate(`/movie/${record.imdbID}`),
        };
      }} />
    </div>
  );
}

export default Movie;

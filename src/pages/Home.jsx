import {
  React, useState, useRef, useEffect,
} from 'react';
import {
  Table, TableColumnProps, Space, Input, Button, Skeleton, Result,
} from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

import { useMovies, genMoviesQueryUrl } from '../api/movies';
import { DEMO } from '../context/DemoContext';

function Movie() {
  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const [queryParams, setQueryParams] = useState({
    title: '',
    year: '',
    page: 1,
  });

  const { data, isLoading, isError } = useMovies(genMoviesQueryUrl(queryParams));

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        },
        multiple: 2,
      },
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => (
        <div className="arco-table-custom-filter">
          <Input.Search
            ref={titleInputRef}
            searchButton
            placeholder="Please enter name"
            value={filterKeys[0] || ''}
            onChange={(value) => {
              setFilterKeys(value ? [value] : []);
            }}
            onSearch={() => {
              const newTitle = titleInputRef.current.dom.value;
              setQueryParams({ ...queryParams, title: newTitle })
              confirm();
            }}
          />
        </div>
      ),
      onFilter: (value, row) => {
        return true
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
      sorter: {
        compare: (a, b) => a.year - b.year,
        multiple: 3,
      },
      filterIcon: <IconSearch />,
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => (
        <div className="arco-table-custom-filter">
          <Input.Search
            ref={yearInputRef}
            searchButton
            placeholder="Please enter year"
            value={filterKeys[0] || ''}
            onChange={(value) => {
              setFilterKeys(value ? [value] : []);
            }}
            onSearch={() => {
              const newYear = yearInputRef.current.dom.value;
              setQueryParams({ ...queryParams, year: newYear })
              confirm()
            }}
          />
        </div>
      ),
      onFilter: (value, row) => {
        return true;
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
      sorter: {
        compare: (a, b) => a.imdbRating - b.imdbRating,
        multiple: 4,
      },
      multiple: 6,
    },
    {
      title: 'Rotten Tomatoes Rating',
      dataIndex: 'rottenTomatoesRating',
      sorter: {
        compare: (a, b) => a.rottenTomatoesRating - b.rottenTomatoesRating,
        multiple: 5,
      },
    },
    {
      title: 'Metacritic Rating',
      dataIndex: 'metacriticRating',
      sorter: {
        compare: (a, b) => a.metacriticRating - b.metacriticRating,
        multiple: 4,
      },
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      sorter: {
        compare: (a, b) => {
          if (a.classification > b.classification) {
            return 1;
          }
          if (a.classification < b.classification) {
            return -1;
          }
          return 0;
        },
        multiple: 1,
      },
    },
  ];

  if (isLoading)
    return <Table columns={columns} loading />;

  if (isError || !data) {
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

  return (
    <div>
      Click the row to see your movie details.
      {DEMO && <small>{JSON.stringify(queryParams)}</small>}
      <Table
        borderCell
        columns={columns}
        data={data.data}
        onRow={(record, index) => ({
          onClick: () => navigate(`/movie/${record.imdbID}`),
        })}
      />
    </div>
  );
}

export default Movie;

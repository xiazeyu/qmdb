import {
  React, useState, useRef, useEffect,
} from 'react';
import {
  Table, Input, Button, Result,
} from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

import { useMovies, genMoviesQueryUrl } from '../api/movies';
import { DEMO } from '../context/DemoContext';

function dropdownTitleComponent(
  titleInputRef,
  filterKeys,
  setFilterKeys,
  confirm,
  setQueryParams,
  queryParams,
) {
  return (
    <div className="arco-table-custom-filter">
      <Input.Search
        ref={titleInputRef}
        searchButton
        placeholder="Please enter name"
        value={filterKeys[0] || ''}
        onChange={(value) => {
          setFilterKeys(value ? [value] : []);
        }}
        onSearch={(value) => {
          setQueryParams({ ...queryParams, title: value, page: 1 });
          confirm();
        }}
      />
    </div>
  );
}

function dropdownYearComponent(
  yearInputRef,
  filterKeys,
  setFilterKeys,
  confirm,
  setQueryParams,
  queryParams,
) {
  return (
    <div className="arco-table-custom-filter">
      <Input.Search
        ref={yearInputRef}
        searchButton
        placeholder="Please enter year"
        value={filterKeys[0] || ''}
        onChange={(value) => {
          setFilterKeys(value ? [value] : []);
        }}
        onSearch={(value) => {
          setQueryParams({ ...queryParams, year: value, page: 1 });
          confirm();
        }}
      />
    </div>
  );
}

function Movie() {
  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const [queryParams, setQueryParams] = useState({
    title: '',
    year: '',
    page: 1,
  });

  const [pagination, setPagination] = useState({
    hideOnSinglePage: true,
    showJumper: true,
    sizeCanChange: false,
    current: 1,
    pageSize: 100,
    total: 1,
    showTotal: true,
  });

  const { data, isLoading, isError } = useMovies(genMoviesQueryUrl(queryParams));

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    setPagination({
      ...pagination,
      current: data.pagination.currentPage,
      pageSize: data.pagination.perPage,
      total: data.pagination.total,
    });
  }, [data]);

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
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => dropdownTitleComponent(
        titleInputRef,
        filterKeys,
        setFilterKeys,
        confirm,
        setQueryParams,
        queryParams,
      ),
      onFilter: () => true,
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
      filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => dropdownYearComponent(
        yearInputRef,
        filterKeys,
        setFilterKeys,
        confirm,
        setQueryParams,
        queryParams,
      ),
      onFilter: () => true,
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

  if (isLoading) return <Table columns={columns} loading />;

  if (isError || !data) {
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

  return (
    <div>
      Click the row to see your movie details.
      {DEMO && (
        <div>
          <br />
          <small>{JSON.stringify(queryParams)}</small>
        </div>
      )}
      {DEMO && <small>{JSON.stringify(pagination)}</small>}
      <Table
        borderCell
        columns={columns}
        data={data.data}
        pagination={pagination}
        onChange={(ipagination, sorter, filters, extra) => {
          if (extra.action === 'paginate') {
            const { current } = ipagination;
            setQueryParams({ ...queryParams, page: current });
          }
        }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/movie/${record.imdbID}`);
          },
        })}
      />
    </div>
  );
}

export default Movie;

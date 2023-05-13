import { React, useEffect, useState } from 'react';

import {
  Layout, Menu, Divider, Grid,
} from '@arco-design/web-react';
import {
  Outlet, Link, useLocation, matchPath, useParams,
} from 'react-router-dom';

const { Item } = Menu;
const { Header, Content, Footer } = Layout;
const { Row, Col } = Grid;

function Root() {
  const DEBUG = true;

  const { id } = useParams();
  const location = useLocation();

  const [selectedKey, setSelectedKey] = useState(['home']);
  const [movieID, setMovieID] = useState(undefined);
  const [peopleID, setPeopleID] = useState(undefined);
  const [showMovie, setShowMovie] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const menuItems = [
    { key: 'home', url: '/' },
    { key: 'movie', url: '/movie/:id' },
    { key: 'people', url: '/people/:id' },
    { key: 'auth', url: '/auth/login' },
    { key: 'auth', url: '/auth/register' },
    { key: 'logout', url: '/auth/logout' },
  ];

  useEffect(() => {
    const path = location.pathname;
    const menuItem = menuItems.find((item) => matchPath({ path: item.url }, path));
    if (menuItem.key === 'home') {
      setShowMovie(false);
      setShowPeople(false);
      setMovieID(undefined);
      setPeopleID(undefined);
    }
    if (menuItem.key === 'movie') {
      setShowMovie(true);
      setShowPeople(false);
      setMovieID(id);
      setPeopleID(undefined);
    }
    if (menuItem.key === 'people') {
      if (movieID) {
        setShowMovie(true);
        setShowPeople(true);
      } else {
        setShowMovie(false);
        setShowPeople(true);
      }
      setPeopleID(id);
    }
    setSelectedKey(menuItem ? [menuItem.key] : ['home']);
  }, [location, id]);

  return (
    <div className="Root">
      <Layout style={{ height: '400px' }}>
        <Row gutter={[24, 24]}>
          <Col span={12} offset={6}>
            <Header>
              <div className="menu">
                <Menu mode="horizontal" selectedKeys={selectedKey}>
                  <Item
                    key="logo"
                    style={{ padding: 0, marginRight: 38 }}
                    disabled
                  >
                    <div
                      style={{
                        width: 80,
                        height: 30,
                        borderRadius: 2,
                        background: 'var(--color-fill-1)',
                        color: 'blue',
                        cursor: 'text',
                        fontSize: 28,
                      }}
                    >
                      QMDB
                    </div>
                  </Item>

                  <Link to="/"><Item key="home">Home</Item></Link>
                  {showMovie && <Link to={`movie/${movieID}`}><Item key="movie">Movie</Item></Link>}
                  {showPeople && <Link to={`people/${peopleID}`}><Item key="people">People</Item></Link>}
                  {!isLoggedIn && <Link to="auth/login"><Item key="auth">Login / Register</Item></Link>}
                  {isLoggedIn && <Link to="auth/logout"><Item key="logout">Logout</Item></Link>}
                  {DEBUG && <Divider type="vertical" />}
                  {DEBUG && <Link to="movie/tt2911666"><Item key="debug_movie">Movie: John Wick</Item></Link>}
                  {DEBUG && <Link to="people/nm0000206"><Item key="debug_people">People: Keanu Reeves</Item></Link>}
                  {DEBUG && <Link to="nonexist"><Item key="debug_noexist">Nonexist</Item></Link>}
                </Menu>
              </div>
            </Header>
          </Col>
          <Col span={12} offset={6}>
            <Content>
              <Outlet />
            </Content>
          </Col>
          <Col span={12} offset={6}>
            <Footer>
              <div style={{ whiteSpace: 'nowrap' }}>
                <small>Made by Zeyu Xia (n11398299) @ QUT. 2023. </small>
                {movieID && (
                <small style={{ whiteSpace: 'nowrap' }}>
                  Current movie:
                  {movieID}
                  .
                  {' '}
                </small>
                )}
                {peopleID && (
                <small style={{ whiteSpace: 'nowrap' }}>
                  Current people:
                  {peopleID}
                  .
                  {' '}
                </small>
                )}
              </div>
            </Footer>
          </Col>
        </Row>
      </Layout>
    </div>
  );
}
export default Root;

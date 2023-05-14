import {
  React, useEffect, useState, useContext,
} from 'react';

import {
  Layout, Menu, Divider, Grid, Message, Button,
} from '@arco-design/web-react';
import {
  Outlet, Link, useLocation, matchPath, useParams,
} from 'react-router-dom';

import { DEMO } from '../context/DemoContext';
import { AuthContext } from '../context/AuthContext';

const { Item } = Menu;
const { Header, Content, Footer } = Layout;
const { Row, Col } = Grid;

function Root() {
  const {
    accessToken,
    refreshToken,
    accessExpiry,
    refreshExpiry,
    doLogout,
    doRefresh,
    canRefresh,
  } = useContext(AuthContext);

  const { id } = useParams();
  const location = useLocation();

  const [selectedKey, setSelectedKey] = useState(['home']);
  const [movieID, setMovieID] = useState(undefined);
  const [peopleID, setPeopleID] = useState(undefined);
  const [showMovie, setShowMovie] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

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

  const refreshInterval = 5 * 60 * 1000; // 5 minutes
  const intervalId = setInterval(async () => {
    if (canRefresh()) {
      const { success, message } = await doRefresh();
      if (!success) {
        Message.error(message);
        doLogout();
      } else {
        Message.success('Refreshed token');
      }
    }
  }, refreshInterval);

  useEffect(() => () => {
    clearInterval(intervalId);
  }, []);

  return (
    <div className="Root">
      <Layout style={{ height: '400px' }}>
        <Row gutter={[24, 24]}>
          <Col span={18} offset={3}>
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
                  {!accessToken && <Link to="auth/login" state={{ from: location }}><Item key="auth">Login / Register</Item></Link>}
                  {accessToken && (
                    <Item
                      onClick={
                        async () => {
                          const { success, message } = await doLogout();
                          if (success) {
                            Message.success(message);
                          } else {
                            Message.error(message);
                          }
                        }
                      }
                      key="logout"
                    >
                      Logout
                    </Item>
                  )}
                  {DEMO && <Divider type="vertical" />}
                  {DEMO && (
                    <Item
                      onClick={
                        async () => {
                          const { success, message } = await doRefresh();
                          if (success) {
                            Message.success(message);
                          } else {
                            Message.error(message);
                          }
                        }
                      }
                      key="refresh"
                    >
                      Refresh
                    </Item>
                  )}
                  {DEMO && <Link to="movie/tt2911666"><Item key="debug_movie">Movie: John Wick</Item></Link>}
                  {DEMO && <Link to="movie/na"><Item key="na_movie">Movie: NA</Item></Link>}
                  {DEMO && <Link to="people/nm0000206"><Item key="debug_people">People: Keanu Reeves</Item></Link>}
                  {DEMO && <Link to="people/na"><Item key="na_people">People: NA</Item></Link>}
                  {DEMO && <Link to="nonexist"><Item key="debug_noexist">Nonexist</Item></Link>}
                </Menu>
              </div>
            </Header>
          </Col>
          <Col span={18} offset={3}>
            <Content>
              <Outlet />
            </Content>
          </Col>
          <Col span={18} offset={3}>
            <Footer>
              <div style={{ whiteSpace: 'nowrap' }}>
                <small>Made by Zeyu Xia (n11398299) @ QUT. 2023. </small>
                {DEMO && movieID && (
                  <small style={{ whiteSpace: 'nowrap' }}>
                    Current movie:
                    {movieID}
                    .
                    {' '}
                  </small>
                )}
                {DEMO && peopleID && (
                  <small style={{ whiteSpace: 'nowrap' }}>
                    Current people:
                    {peopleID}
                    .
                    {' '}
                  </small>
                )}
              </div>
              <div>
                {DEMO && (accessToken ? (
                  <small>
                    AccessToken:
                    {accessToken}
                    . Until
                    {' '}
                    {new Date(accessExpiry).toString()}
                    {' '}
                  </small>
                ) : <small>No accessToken.</small>)}
                {DEMO && (refreshToken ? (
                  <small>
                    refreshToken:
                    {refreshToken}
                    . Until
                    {' '}
                    {new Date(refreshExpiry).toString()}
                    {' '}
                    <Button onClick={
                      async () => {
                        const { success, message } = await doRefresh();
                        if (success) {
                          Message.success(message);
                        } else {
                          Message.error(message);
                        }
                      }
}
                    >
                      Refresh
                    </Button>
                  </small>
                ) : <small>No refreshToken.</small>)}
              </div>
            </Footer>
          </Col>
        </Row>
      </Layout>
    </div>
  );
}
export default Root;

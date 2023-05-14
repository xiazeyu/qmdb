import React from 'react';

import { useRouteError, Link } from 'react-router-dom';
import {
  Typography, Result, Button, Grid,
} from '@arco-design/web-react';
import { IconFaceFrownFill } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error); // eslint-disable-line no-console
  const errorToShow = error.status ? `${error.status} ${error.statusText}` : error.toString();
  //   {
  //     "status": 404,
  //     "statusText": "Not Found",
  //     "internal": true,
  //     "data": "Error: No route matches URL \"/nonexist\"",
  //     "error": {}
  //   }

  return (

    <div id="error-page">

      <Row className="grid" style={{ marginBottom: 16 }}>
        <Col span={12} offset={6}>
          <Result
            status="error"
            icon={<IconFaceFrownFill />}
            title={errorToShow}
            subTitle={error.data}
            extra={<Link to="/"><Button type="primary">Go Home</Button></Link>}
          >
            <Typography
              className="result-content"
              style={{
                background: 'var(--color-fill-2)', padding: 24,
              }}
            >
              <Typography.Paragraph>Try:</Typography.Paragraph>
              <ul>
                <li> Following the instruction above (if exist) </li>
                <li> Wait for a while and try again </li>
                <li> Checking the network cables, modem, and router </li>
                <li> Reconnecting to Wi-Fi </li>
              </ul>
            </Typography>
          </Result>
        </Col>
      </Row>
    </div>
  );
}

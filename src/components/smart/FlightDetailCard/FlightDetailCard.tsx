import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Divider } from 'antd';
import moment from 'moment';
import {
  ArrowRightOutlined,
  MobileOutlined,
  MinusCircleOutlined,
  DiffOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import './FlightDetailCard.scss';
import FlightInfoDrawer from '../FlightInfoDrawer/FlightInfoDrawer';
import { Link } from 'react-router-dom';

const FlightDetailCard = ({
  fromDate = '02-02-2021',
  toDate = '03-02-2021',
  departure = 'Karachi',
  departureSub = 'KTC',
  destination = 'Lahore',
  destinationSub = 'Lhr',
  plan = '1 passenger',
  type = 'Return',
  departureImg = 'https://source.unsplash.com/1600x900/?lahore',
  departureTime,
  arrivalTime
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  console.log(
    'testingValues',
    fromDate,
    toDate,
    departure,
    departureSub,
    destination,
    destinationSub,
    plan,
    type,
    departureImg,
  );
  return (
    <div className="flight-detail-card-item">
      <Row className="flightDetails" justify="space-between">
        <Col xs={24} sm={24} md={23} lg={23} style={{ padding: '20px' }}>
          <Row justify={'space-between'}>
            <Col xs={24} sm={24} md={24} lg={10}>
              <div className="cardFirstPart">
                <span>{moment(departureTime).format('hh:m')}</span>
                <Divider>
                  <img src="https://www.qatarairways.com/content/dam/images/icons/flight/ic_nav_qatar_airways.svg" />
                </Divider>
                <span>{moment(arrivalTime).format('hh:m')}</span>
              </div>
              <div className="cardSecondPart dullWhite">
                <span>{departureSub}</span>
                {/* <span>2 Stops, 19h 20m</span> */}
                <span>{destinationSub}</span>
              </div>

              <div className="lower-div mt-none mt-50">
                <span
                  className="flightDetails2 font-size"
                  onClick={() => setShowDrawer(true)}
                >
                  Flight Details
                </span>
                <span className="hideAbove768">XOF 1,137,300</span>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              className="thirdPart hide-card-part"
            >
              <div className="card">
                <Link to="/passanger-details">
                  <div>
                    <span className="cardhead">Economy</span>
                    <br />
                    <span style={{ fontSize: '30px' }}>XOF 1,137,300</span>
                  </div>
                </Link>
              </div>

              <div className="card">
                <Link to="/passanger-details">
                  <div>
                    <span className="cardhead">Business</span>
                    <br />
                    <span style={{ fontSize: '30px' }}>XOF 2,087,300</span>
                  </div>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <FlightInfoDrawer
        open={showDrawer}
        setOpen={setShowDrawer}
        key="FlightInfoDrawer"
      />
    </div>
  );
};

export default FlightDetailCard;

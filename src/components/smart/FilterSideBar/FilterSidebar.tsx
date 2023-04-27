import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import transitionIcon from '../../../assets/trans-img.png';
// @ts-ignore
import planeIcon from '../../../assets/ticketBlack.svg';

import './FilterSideBar.scss';
import moment from 'moment';
import { Radio, Space } from 'antd';

const FilterSidebar = ({ data = [], collapsed, setCollapsed }) => {
  const [flightInfo, setFlightInfo] = useState({
    origin: '',
    destination: '',
    passengerCount: 0,
    cabinClass: '',
    isReturnFlight: false,
    startDate: '',
    endDate: '',
  });
  const [sortBy, setSortBy] = useState(1);
  const [stopsFilter, setStopsFilter] = useState(0);
  const getFlightInfo = () => {
    const offerInfo = data.find((item) => item.slices[0].segments.length == 1);
    let startDate;
    let endDate;
    if (offerInfo) {
      const origin = offerInfo.slices[0].segments[0].origin.iata_city_code;
      const destination =
        offerInfo.slices[0].segments[0].destination.iata_city_code;
      const passengerCount = offerInfo.slices[0].segments[0].passengers.length;
      const cabinClass =
        offerInfo.slices[0].segments[0].passengers[0].cabin_class;
      const isReturnFlight = offerInfo.slices.length > 1;
      if (isReturnFlight) {
        startDate = offerInfo.slices[0].segments[0].departing_at;
        endDate =
          offerInfo.slices[offerInfo.slices.length - 1].segments[
            offerInfo.slices[0].segments.length - 1
          ].arriving_at;
      } else {
        startDate = offerInfo.slices[0].segments[0].departing_at;
        endDate =
          offerInfo.slices[0].segments[offerInfo.slices[0].segments.length - 1]
            .arriving_at;
      }
      return {
        origin,
        destination,
        passengerCount,
        cabinClass,
        isReturnFlight,
        startDate,
        endDate,
      };
    }
  };

  useEffect(() => {
    const result = getFlightInfo();
    setFlightInfo(result);
  }, [data]);

  return (
    <>
      {!collapsed ? (
        <div
          className="sideBarOverlay"
          onClick={() => setCollapsed((prevState) => !prevState)}
        />
      ) : (
        ''
      )}
      {!collapsed ? (
        <Sider
          width={240}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            overflowY: 'auto',
            marginTop: '20px',
            zIndex: 20,
          }}
          className="filter-sidebar"
        >
          <div className="about-info">
            <div className="flight-info">
              <span>{flightInfo?.origin}</span>
              <span>
                {flightInfo?.isReturnFlight ? (
                  <img src={transitionIcon} width={40} />
                ) : (
                  <img src={planeIcon} width={40} />
                )}
              </span>
              <span>{flightInfo?.destination}</span>
            </div>
            <div className="date-section">
              <span>
                {moment(flightInfo?.startDate).format('MMM Do YY')} -{' '}
                {moment(flightInfo?.endDate).format('MMM Do YY')}
              </span>
            </div>
            <div className="other-info-section">
              <span className="child-section">
                {flightInfo?.cabinClass.toUpperCase()}
              </span>
              <span className="child-section">
                Passengers {flightInfo?.passengerCount}
              </span>
            </div>
            <div className="sort-section">
              <span className="sort-heading">Sort by</span>
              <Radio.Group
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <Space direction="vertical">
                  <Radio value={1}>Least expensive</Radio>
                  <Radio value={2}>Most Expensive</Radio>
                  <Radio value={3}>Shortest duration</Radio>
                  <Radio value={4}>Longest duration</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="sort-section">
              <span className="sort-heading">Stops</span>
              <Radio.Group
                onChange={(e) => setStopsFilter(e.target.value)}
                value={stopsFilter}
              >
                <Space direction="vertical">
                  <Radio value={0}>Direct only</Radio>
                  <Radio value={1}>1 stop at most</Radio>
                  <Radio value={2}>2 stops at most</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Sider>
      ) : (
        <></>
      )}
    </>
  );
};

export default FilterSidebar;
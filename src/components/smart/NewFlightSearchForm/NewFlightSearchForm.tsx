import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Popover,
  Radio,
  Slider,
  DatePickerProps,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './NewFlightSearchForm.scss';
import { useHistory } from 'react-router-dom';
import { searchFlightAPI } from '@client/services/searchFlightService';
import Spin from '@client/components/presentational/Spin';
// @ts-ignore
import { searchPlacesAPI } from '@client/services/searchPlacesServices';
import { getAllAirlinesAPI } from '@client/services/airlineServices';
import { SliderMarks } from 'antd/es/slider';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
interface FlightSearchFormProps {
  isStickyNav?: boolean;
}

const marks: SliderMarks = {
  0: '00:00',
  8: '08:00',
  16: '16:00',
  22.99: '23:59',
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().endOf('day');
};

const NewFlightSearchForm = ({}: FlightSearchFormProps) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [allAirlines, setAllAirlines] = useState([]);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [departureVisibility, setDepartureVisibility] = useState(false);
  const [returnVisibility, setReturnVisibility] = useState(false);
  const [ticketType, setTicketType] = useState('oneWay');
  const [hideFilter, setHideFilter] = useState(false);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [departureTime, setDepartureTime] = useState({
    takeOff: [],
    landing: [],
  });
  const [returnTime, setReturnTime] = useState({
    takeOff: [],
    landing: [],
  });

  useEffect(() => {
    console.log(departureTime, 'departureTime');
  }, [departureTime]);

  const cabinClass = [
    { label: 'Economy', value: 'economy' },
    { label: 'Premium Economy', value: 'premium_economy' },
    { label: 'Business', value: 'business' },
    { label: 'First', value: 'first' },
    { label: 'Any', value: 'any' },
  ];

  const airlines = [
    { label: 'Fly Dubai', value: '1' },
    { label: 'Fly Emirates', value: '2' },
    { label: 'PIA', value: '3' },
    { label: 'Blue Airline', value: '4' },
    { label: 'Sky Ways', value: '5' },
    { label: 'Qatar Airways', value: '6' },
  ];

  const onFinish = async (values) => {
    const passengers = [
      ...[...new Array(adult)].map((item) => {
        return { type: 'adult' };
      }),
      ...[...new Array(children)].map((item) => {
        return { type: 'child' };
      }),
    ];

    const payload = {
      origin: values.origin,
      destination: values.destination,
      departure_date: values.departure_date?.toISOString(),
      return_date: values.return_date?.toISOString(),
      cabin_class: values.cabin_class,
      passengers: passengers,
      return_offer: ticketType == 'return' ? true : false,
    };
    try {
      setIsLoading(true);
      const response = await searchFlightAPI(payload);
      setIsLoading(false);
      history.push(`/flight-details/${response.data?.offer_id}`);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  // useEffect(() => {
  //   const getAllAirlines = async () => {
  //     try {
  //       const {data} = await getAllAirlinesAPI();
  //       setAllAirlines(data?.offer?.data)
  //     } catch (e) {
  //       console.log('e', e);
  //     }
  //   };
  //   getAllAirlines();
  // }, []);

  const handleStudentSearch = async (value, type) => {
    try {
      setIsSearching(true);
      const result = await searchPlacesAPI(value);
      type == 'origin'
        ? setDepartureCities(result?.data?.offer?.data)
        : setDestinationCities(result?.data?.offer?.data);
      setIsSearching(false);
    } catch (error) {
      setIsSearching(false);
      console.log('error', error);
    }
  };

  function handleCount(type: string, method: string) {
    if (method === 'add') {
      type === 'adult' ? setAdult(adult + 1) : setChildren(children + 1);
    } else {
      if (type === 'adult' && adult > 0) {
        setAdult(adult - 1);
      } else if (children > 0) {
        setChildren(children - 1);
      }
    }
  }
  return (
    <>
      <div className="flight-search-form">
        <div className="paddingLR">
          <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
              cabin_class: 'economy',
            }}
          >
            <Row className="MainRow">
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="mar-b flex-item">
                  <label className="trip-label">Select Trip Type</label>
                  <Radio.Group
                    onChange={(e) => setTicketType(e.target.value)}
                    value={ticketType}
                    defaultValue={ticketType}
                  >
                    <Radio value="oneWay">
                      <span className="radioHeading">One Way</span>
                    </Radio>
                    <Radio value="return">
                      <span className="radioHeading">Return</span>
                    </Radio>
                    <Radio value="multi-city">
                      <span className="radioHeading">Multi City</span>
                    </Radio>
                  </Radio.Group>
                </div>
              </Col>
              <Row gutter={[8, 0]} style={{ width: '100%' }}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    label="Origin"
                    name="origin"
                    rules={[
                      {
                        required: true,
                        message: 'Search Departure city',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      className="autoCompletegeneral"
                      style={{ width: '100%' }}
                      placeholder="Search Departure City"
                      notFoundContent={null}
                      onChange={(value) => setOriginCity(value)}
                      onSearch={(value) => {
                        handleStudentSearch(value, 'origin');
                      }}
                      filterOption={false}
                      value={originCity}
                      loading={isSearching}
                    >
                      {departureCities?.map((item, index) => {
                        console.log('item', item);
                        return (
                          <Select.Option value={item.iata_code} key={index}>
                            {`${item.city_name} (${item.name})`}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    label="Destination"
                    name="destination"
                    rules={[
                      {
                        required: true,
                        message: 'Search destination city',
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Search Arrival City"
                      optionFilterProp="children"
                      className="arrival-city"
                      notFoundContent={null}
                      onChange={(value) => setDestinationCity(value)}
                      onSearch={(value) => {
                        handleStudentSearch(value, 'destination');
                      }}
                      filterOption={false}
                      value={destinationCity}
                      loading={isSearching}
                    >
                      {destinationCities?.map((item, index) => {
                        return (
                          <Select.Option value={item.iata_code} key={index}>
                            {`${item.city_name} (${item.name})`}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {ticketType === 'return' ? (
                <>
                  <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                      name="departure_date"
                      rules={[
                        {
                          required: true,
                          message: 'Select departure date',
                        },
                      ]}
                      label="Departure Date"
                      className="form-input"
                    >
                      <DatePicker
                        style={{ width: '99%', padding: '14px' }}
                        disabledDate={disabledDate}
                      />
                    </Form.Item>
                    <Popover
                      placement={`bottom`}
                      trigger="click"
                      open={departureVisibility}
                      content={
                        <div style={{ width: '280px' }}>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>
                                <img
                                  className="planeLogo"
                                  src="https://www.svgrepo.com/show/57834/takeoff-the-plane.svg"
                                />
                                Take Off
                              </span>

                              <span className="anyTimeText">
                                {departureTime.takeOff.length === 1
                                  ? 'After' + departureTime.takeOff + ':00'
                                  : 'At any time'}
                              </span>
                            </div>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => {
                                setDepartureTime((prevState) => ({
                                  ...prevState,
                                  takeOff: [e],
                                }));
                              }}
                            />
                          </div>
                          <br />
                          <div>
                            <span>
                              <img
                                className="planeLogo"
                                src="https://www.svgrepo.com/show/122269/plane-landing.svg"
                              />
                              Landing
                            </span>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => {
                                setReturnTime((prevState) => ({
                                  ...prevState,
                                  landing: [e[1]],
                                }));
                              }}
                            />
                          </div>
                          <div className="dflexFlexEnd">
                            <Button
                              className="btnConfirm"
                              onClick={() => setDepartureVisibility(false)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div
                        className="containerBtn"
                        onClick={() =>
                          setDepartureVisibility(!departureVisibility)
                        }
                      >
                        <span className="btnAnyTime">At any time</span>
                        <span style={{ color: '#985eaf' }}>
                          <DownOutlined />
                        </span>
                      </div>
                    </Popover>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                      label="Return Date"
                      name="return_date"
                      className="form-input popover-anyTime"
                      rules={[
                        {
                          required: true,
                          message: 'Select Return date',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '99%', padding: '14px' }}
                        disabledDate={disabledDate}
                      />
                    </Form.Item>
                    <Popover
                      placement={`bottom`}
                      trigger="click"
                      open={returnVisibility}
                      content={
                        <div style={{ width: '300px' }}>
                          <div>
                            <span>
                              <img
                                className="planeLogo"
                                src="https://www.svgrepo.com/show/57834/takeoff-the-plane.svg"
                              />
                              Take Off
                            </span>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => console.log(e)}
                            />
                          </div>
                          <br />
                          <div>
                            <span>
                              <img
                                className="planeLogo"
                                src="https://www.svgrepo.com/show/122269/plane-landing.svg"
                              />
                              Landing
                            </span>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => console.log(e)}
                            />
                          </div>
                          <div className="dflexFlexEnd">
                            <Button
                              className="btnConfirm"
                              onClick={() => setReturnVisibility(false)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="containerBtn">
                        <span
                          className="btnAnyTime"
                          onClick={() => setReturnVisibility(!returnVisibility)}
                        >
                          At any time
                        </span>
                        <span style={{ color: '#985eaf' }}>
                          <DownOutlined />
                        </span>
                      </div>
                    </Popover>
                  </Col>
                </>
              ) : (
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item
                    name="departure_date"
                    rules={[
                      {
                        required: true,
                        message: 'Select departure date',
                      },
                    ]}
                    label="Departure Date"
                    className="form-input"
                  >
                    <DatePicker
                      style={{ width: '99%', padding: '14px' }}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                  <Col xs={24} sm={24} md={14} lg={14}>
                    <Popover
                      open={departureVisibility}
                      placement={`bottom`}
                      trigger="click"
                      content={
                        <div style={{ width: '300px' }}>
                          <div>
                            <span>
                              <img
                                className="planeLogo"
                                src="https://www.svgrepo.com/show/57834/takeoff-the-plane.svg"
                              />
                              Take Off
                            </span>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => console.log(e)}
                            />
                          </div>
                          <br />
                          <div>
                            <span>
                              <img
                                className="planeLogo"
                                src="https://www.svgrepo.com/show/122269/plane-landing.svg"
                              />
                              Landing
                            </span>
                            <Slider
                              min={0}
                              max={23}
                              range={{ draggableTrack: true }}
                              defaultValue={[0, 23]}
                              marks={marks}
                              onChange={(e) => {
                                setDepartureTime((prevState) => ({
                                  ...prevState,
                                  takeOff: [e[0]],
                                  landing: [e[1]],
                                }));
                              }}
                            />
                          </div>
                          <div className="dflexFlexEnd">
                            <Button
                              className="btnConfirm"
                              onClick={() => setDepartureVisibility(false)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      }
                    ></Popover>
                    <div className="containerBtn">
                      <span
                        className="btnAnyTime"
                        onClick={() =>
                          setDepartureVisibility(!departureVisibility)
                        }
                      >
                        At any time
                      </span>
                      <span style={{ color: '#985eaf' }}>
                        <DownOutlined />
                      </span>
                    </div>
                  </Col>
                </Col>
              )}
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="passengers-count"
                  rules={[
                    {
                      required: false,
                      message: 'Please Enter passengers & class',
                    },
                  ]}
                >
                  <Popover
                    placement={`bottom`}
                    trigger="click"
                    content={
                      <>
                        <div className="agePopover">
                          <div className="ageTitle">
                            <span className="fontSize20">Adults</span>
                            <span className="">18+</span>
                          </div>
                          <Row align={'middle'}>
                            <Button
                              onClick={() => handleCount('adult', 'subtract')}
                              style={{ background: '#701644', opacity: '0.7' }}
                            >
                              <span className="ageIcon">-</span>
                            </Button>

                            <div style={{ minWidth: '20px' }}>
                              <span style={{ marginInline: '10px' }}>
                                {adult}
                              </span>
                            </div>
                            <Button
                              onClick={() => handleCount('adult', 'add')}
                              style={{ background: '#701644' }}
                            >
                              <span className="ageIcon">+</span>
                            </Button>
                          </Row>
                        </div>

                        <div className="agePopover">
                          <div className="ageTitle">
                            <div style={{ minWidth: '20px' }}>
                              <span className="fontSize20">Children</span>
                            </div>
                            <span className="">0--17</span>
                          </div>
                          <Row align={'middle'}>
                            <Button
                              onClick={() =>
                                handleCount('children', 'subtract')
                              }
                              style={{ background: '#701644', opacity: '0.7' }}
                            >
                              <span className="ageIcon">-</span>
                            </Button>

                            <span style={{ marginInline: '10px' }}>
                              {children}
                            </span>
                            <Button
                              onClick={() => handleCount('children', 'add')}
                              style={{ background: '#701644' }}
                            >
                              <span className="ageIcon">+</span>
                            </Button>
                          </Row>
                        </div>
                      </>
                    }
                    onOpenChange={handleOpenChange}
                  >
                    <Form.Item label="Passanger">
                      <Input
                        name="passenger"
                        key="passenger-count"
                        readOnly={true}
                        value={` Adult: ${adult} And  Children :${children}  `}
                        style={{
                          borderRadius: '8px',
                          width: '99%',
                          padding: '14px',
                        }}
                        placeholder="Enter passengers & class"
                        className="form-input"
                        onClick={() => {
                          setOpen(!open);
                        }}
                      />
                    </Form.Item>
                  </Popover>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  label="Class"
                  name="cabin_class"
                  rules={[
                    {
                      required: true,
                      message: 'Select Class Type',
                    },
                  ]}
                >
                  <Select
                    className="autoCompletegeneral"
                    style={{ width: '100%' }}
                    placeholder="Select Class Type"
                  >
                    {cabinClass?.map((item, index) => {
                      return (
                        <Select.Option value={item.value} key={index}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={24} lg={24} className="dflexFlexEnd">
                <span
                  className="fontSize padding-right10 advance-link"
                  onClick={() => {
                    setHideFilter(!hideFilter);
                  }}
                >
                  Advance options
                </span>
              </Col> */}

              {/* {hideFilter && (
                <Col xs={24} sm={24} md={24} lg={24} className="Airline">
                  <Select
                    mode="multiple"
                    placeholder="Select Airline Companies"
                    onChange={handleChange}
                    value={selectedValues}
                  >
                    {allAirlines?.slice(0,15)?.map((item, index) => {
                      return (
                        <Select.Option value={item.value} key={index}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              )} */}

              <Col xs={24} sm={24} md={24} lg={24} className="centerBtn">
                <Button
                  type="default"
                  htmlType="submit"
                  className="form-button btnSearchFlight"
                >
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <span className="showFlightBtn">
                      <span style={{ fontSize: '20px' }}>Show Flights</span>
                      <img
                        className="flighiconsize"
                        src="https://www.svgrepo.com/show/346908/flight-takeoff.svg"
                      />
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default NewFlightSearchForm;

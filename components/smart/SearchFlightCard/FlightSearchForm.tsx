// import React from "react";
// import { Card, Form, Input, Select, DatePicker, Button } from "antd";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { RangePicker } = DatePicker;
// import "./FlightSearchForm.scss";

// const FlightSearchForm: React.FC = () => {
//   const onFinish = (values: any) => {
//     console.log("Received values of form: ", values);
//   };

//   return (
//     <div className="flight-search-form">
//       <Form onFinish={onFinish}>
//         <Form.Item
//           name="from"
//           rules={[{ required: true, message: "Please input the departure city!" }]}
//         >
//           <Input placeholder=" Enter Departure City" className="form-input" />
//         </Form.Item>
//         <Form.Item
//           name="to"
//           rules={[{ required: true, message: "Please input the destination city!" }]}
//         >
//           <Input placeholder="Enter Destination City" className="form-input" />
//         </Form.Item>
//         <Form.Item
//           name="Trip"
//           rules={[{ required: true, message: "Please select the desired Trip" }]}
//         >
//           <Select placeholder="Return">
//             <Option value="1">Return</Option>
//             <Option value="2">One-Way</Option>
//             <Option value="3">Multi-City</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="dates"
//           rules={[{ required: true, message: "Please select the travel dates!" }]}
//         >
//           <RangePicker
//             disabledDate={(current: dayjs.Dayjs) =>
//               current && current < dayjs().startOf("day")
//             }
//             format="DD/MM/YYYY"
//           />
//         </Form.Item>
//         <Form.Item
//           name="passengers"
//           rules={[
//             { required: true, message: "Please select the number of passengers!" },
//           ]}
//         >
//           <Select placeholder="Number of Passengers">
//             <Option value="1">1</Option>
//             <Option value="2">2</Option>
//             <Option value="3">3</Option>
//             <Option value="4">4</Option>
//           </Select>
//         </Form.Item>
//         <div className="search-button-wrapper">
//           <Form.Item>
//             <Button type="default" htmlType="submit" className="form-button">
//               Search Flights
//             </Button>
//           </Form.Item>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default FlightSearchForm;
import React from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import dayjs from 'dayjs';
import './FlightSearchForm.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FlightSearchForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="flight-search-form">
      <div className="paddingLR">
        <Form onFinish={onFinish}>
          <Row justify={'center'}>
            <Col xs={24} sm={24} md={24} lg={5}>
              <Form.Item
                name="from"
                rules={[
                  {
                    required: true,
                    message: 'Please input the departure city!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter Departure City"
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={5}>
              <Form.Item
                name="to"
                rules={[
                  {
                    required: true,
                    message: 'Please input the destination city!',
                  },
                ]}
              >
                <Input
                  placeholder="Enter Destination City"
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={3}>
              <Form.Item
                name="Trip"
                rules={[
                  { required: true, message: 'Please select the desired Trip' },
                ]}
              >
                <Select
                  style={{ height: '55px' }}
                  placeholder="Return"
                  className="form-input"
                >
                  <Option value="1">Return</Option>
                  <Option value="2">One-Way</Option>
                  <Option value="3">Multi-City</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={5}>
              <Form.Item
                name="dates"
                rules={[
                  {
                    required: true,
                    message: 'Please select the travel dates!',
                  },
                ]}
              >
                <RangePicker
                  disabledDate={(current: dayjs.Dayjs) =>
                    current && current < dayjs().startOf('day')
                  }
                  format="DD/MM/YYYY"
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={5}>
              <Form.Item
                name="passengers"
                rules={[
                  {
                    required: true,
                    message: 'Please select the number of passengers!',
                  },
                ]}
              >
                <Select
                  placeholder="Number of Passengers"
                  className="form-input"
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={23} className="flexEnd">
              <Button
                type="default"
                htmlType="submit"
                className="form-button btnSearchFlight"
              >
                Search Flights
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      {/* <div className="search-button-wrapper"></div> */}
    </div>
  );
};

export default FlightSearchForm;

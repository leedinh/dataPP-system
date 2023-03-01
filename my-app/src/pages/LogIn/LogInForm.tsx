import React from "react";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";

const onFinish = async (values: any) => {
  console.log(JSON.stringify(values));

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  };

  const response = await fetch('/api/login', requestOptions);
  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    console.log('Access token stored:', data.access_token);
  } else {
    console.log('Access token not found in response');
  }

  console.log(data);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const LogInForm: React.FC = () => (
  <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
    <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-semibold">Sign In</h1>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item>
          <Row justify="space-between">
            <Col xs={16}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={8}>
              <a className="login-form-forgot">Forgot password</a>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Col>
  </Row>
);

export default LogInForm;

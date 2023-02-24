import React from "react";
import { Button, Checkbox, Form, Input } from "antd";

const onFinish = async (values: any) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  };

  const response = await fetch('http://127.0.0.1:5000/api/login', requestOptions);
  const data = await response.json();

  console.log(data);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const LogInForm: React.FC = () => (
  <div className="place-self-center w-1/3">
    <div className="text-5xl mb-8 font-semibold">Sign In</div>
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
        rules={[{ required: true, message: "Please input your username!" }]}
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
        <div className="flex justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot">Forgot password</a>
        </div>
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
  </div>
);

export default LogInForm;

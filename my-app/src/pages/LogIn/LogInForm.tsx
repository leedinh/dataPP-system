import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";

import { useAppDispatch, useAppSelector } from "redux/store";
import { logInThunk } from "redux/features/auth/thunks";
import { selectEmail, selectLogInStatus } from "redux/features/auth/slice";
import { StatusEnum } from "redux/constant";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const LogInForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLogInStatus);
  const email = useAppSelector(selectEmail);
  const navigate = useNavigate();

  const logIn = async (values: any) => {
    dispatch(
      logInThunk({
        email: values["email"]?.toString(),
        password: values["password"]?.toString(),
      })
    );
  };

  useEffect(() => {
    if (status === StatusEnum.SUCCEEDED) {
      navigate("/");
    }
  }, [status, dispatch]);

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-semibold">Log In</h1>
        </div>
        <Form
          name="logIn"
          labelCol={{ span: 8 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={logIn}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            initialValue={email}
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input name="emailInfo" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item className="">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
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
        <div className="">
          Don't have an account? <a href="/signUp">Sign Up</a>
        </div>
      </Col>
    </Row>
  );
};

export default LogInForm;

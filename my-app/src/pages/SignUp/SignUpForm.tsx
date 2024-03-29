import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";

import { useAppDispatch, useAppSelector } from "redux/store";
import { signUpThunk } from "redux/features/auth/thunks";
import { selectSignUpStatus } from "redux/features/auth/slice";
import { StatusEnum } from "redux/constant";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const LogInForm: React.FC = () => {
  const [signUpForm] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectSignUpStatus);
  const signUp = async (values: any) => {
    dispatch(signUpThunk(values));
  };

  useEffect(() => {
    if (status === StatusEnum.SUCCEEDED) {
      navigate("/logIn");
    }
  }, [status, dispatch, navigate]);

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
        <div className="text-left mb-8">
          <h1 className="text-5xl font-semibold">Sign Up</h1>
        </div>
        <Form
          form={signUpForm}
          name="signUp"
          size="large"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={signUp}
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

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
              {
                validator: (_, value) =>
                  value === signUpForm.getFieldValue("password")
                    ? Promise.resolve()
                    : Promise.reject(new Error("Wrong confirm password")),
              },
            ]}
          >
            <Input.Password size="large" visibilityToggle={false} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full mt-4"
              size="large"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Divider>
          Don't have an account? <a href="/logIn">Log In</a>
        </Divider>
      </Col>
    </Row>
  );
};

export default LogInForm;

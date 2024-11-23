import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import '../css/Signup.css';

const { Title } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    const { username, email, password } = values;

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });

      const responseData = await response.json();

      if (responseData.status) {
        message.success("You have successfully registered!");
        navigate('/Signin');
      } else {
        message.error(responseData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      message.error("An error occurred during registration. Please try again.");
    }
  };

  const validatePasswords = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Passwords do not match!'));
  };

  return (
    <div className="signup-container">
      <Form
        form={form}
        name="signup"
        layout="vertical"
        onFinish={handleSignup}
        className="signup-form"
      >
        <h1>Sign Up</h1>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter your username!' }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }]}
          
          hasFeedback
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Re-enter Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please re-enter your password!' },
            { validator: validatePasswords },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Re-enter your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign Up Proceed
          </Button>
        </Form.Item>
        <div className="text-center">
          Already have an account? <a href="/Signin">Sign in</a>
        </div>
      </Form>
      <div className="body-background"></div>
    </div>
  );
};

export default Signup;

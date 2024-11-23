import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Form, Input, Checkbox, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../css/signin.css';

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (responseData.status) {
        const { token, user } = responseData;
        Cookies.set('token', token, { expires: 7 });
        
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Welcome back!`,
          text: `Logged in as ${user.name}`,
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'small-popup',
            content: 'small-font'
          }
        });

        navigate(user.role === "book_manage" ? '/Home2' : '/Home2');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Please check your email and password.',
          customClass: {
            popup: 'small-popup',
            content: 'small-font'
          }
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to the server. Please try again.',
        customClass: {
          popup: 'small-popup',
          content: 'small-font'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-signin-form">
      <Form
        name="signin"
        layout="vertical"
        onFinish={handleSignin}
        initialValues={{ remember: true }}
      >
        <h5>Sign in to our platform</h5>
        
        <Form.Item
          label="Your email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="name@company.com"
          />
        </Form.Item>

        <Form.Item
          label="Your password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Login to your account'}
          </Button>
        </Form.Item>

        <div className="text-sm">
          Not registered?{" "}
          <a href="/Signup" className="text-blue-700">
            Create account
          </a>
        </div>
      </Form>
    </div>
  );
};

export default Signin;
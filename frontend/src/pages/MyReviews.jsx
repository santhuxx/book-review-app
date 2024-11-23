import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Spin, Typography, Modal, Form, Input, Rate, message, Alert, Menu } from "antd";
import { LogoutOutlined, PlusOutlined, HomeOutlined, BookOutlined,EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "../css/MyReviews.css"; 

const { Title, Text } = Typography;
const { TextArea } = Input;

const Navbar = ({ userEmail, onLogout, onAddReview }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar-wrapper">
      <Menu mode="horizontal" className="navbar">
        <div className="navbar-left">
          {userEmail && (
            <div className="navbar-user">
              <Text className="navbar-user">Welcome, {userEmail}</Text>
            </div>
          )}
        </div>
        <div className="navbar-right">
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/Home2')}>
            Home
          </Menu.Item>
          <Menu.Item key="addReview" icon={<PlusOutlined />} onClick={onAddReview}>
            Add Review
          </Menu.Item>
          <Menu.Item key="myReviews" icon={<BookOutlined />} onClick={() => navigate('/MyReview')}>
            My Reviews
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Menu.Item>
        </div>
      </Menu>
      <div className="body-background"></div>
    </div>
  );
};

// Update Review Modal Component
const UpdateReviewModal = ({ visible, onCancel, review, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && review) {
      form.setFieldsValue({
        title: review.title,
        author: review.author,
        rating: review.rating,
        reviewText: review.reviewText,
      });
    }
  }, [visible, review, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...values, dateAdded: new Date() }),
      });

      if (!response.ok) throw new Error("Failed to update review");

      message.success("Review updated successfully");
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Review"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="add-review-modal"
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please input the author!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: "Please input the rating!" }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="reviewText"
          label="Review"
          rules={[{ required: true, message: "Please input your review!" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const AddReviewModal = ({ visible, onCancel, userEmail, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...values,
          userEmail,
          dateAdded: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create review');
      
      message.success('Review added successfully');
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error('Failed to add review');
      console.error('Error adding review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Review"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="add-review-modal"
    >
      <Form 
        form={form} 
        onFinish={handleSubmit} 
        layout="vertical" 
        className="add-review-form"
      >
        <Form.Item
          name="title"
          label="Book Title"
          rules={[{ required: true, message: 'Please input the book title!' }]}
        >
          <Input placeholder="Enter the book title" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Author Name"
          rules={[{ required: true, message: 'Please input the author name!' }]}
        >
          <Input placeholder="Enter the author's name" />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: 'Please select a rating!' }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="reviewText"
          label="Your Review"
          rules={[{ required: true, message: 'Please input your review!' }]}
        >
          <TextArea rows={4} placeholder="Write your review here..." />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
          >
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const MyReviews = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/auth/validate-token", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        } else {
          navigate("/signin");
        }
      } catch {
        navigate("/signin");
      }
    };

    fetchUserRole();
  }, [navigate]);

  const fetchUserReviews = async () => {
    if (!userEmail) return;

    try {
      setLoading(true);
      const response = await fetch("/api/reviews", { credentials: "include" });

      if (!response.ok) throw new Error("Failed to load reviews");

      const allReviews = await response.json();
      const userReviews = allReviews.filter(
        (review) => review.userEmail === userEmail
      );
      setReviews(userReviews);
    } catch {
      setError("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [userEmail]);

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      message.success("Review deleted successfully");
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch {
      message.error("Failed to delete review");
    }
  };

  const handleUpdateClick = (review) => {
    setSelectedReview(review);
    setIsUpdateModalVisible(true);
  };

  const logout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setUserEmail(null);
        navigate('/signin');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setReviews(data);
      setFilteredReviews(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="home-container">
      <Navbar 
        userEmail={userEmail} 
        onLogout={logout} 
        onAddReview={() => setIsAddModalVisible(true)} 
      />
    <div className="content">
      <div className="filters-container">
        <Title level={2}>My Reviews</Title>
      </div>
      <div className="review-list">
  {loading ? (
    <Spin size="large" />
  ) : error ? (
    <Alert type="error" message={error} />
  ) : reviews.length > 0 ? (
    reviews.map((review) => (
      <Card
        key={review._id}
        className="review-card"
        title={<span>{review.title}</span>}
        extra={
          <Text className="review-date">
            {new Date(review.dateAdded).toLocaleDateString()}
          </Text>
        }
      >
        <div className="review-content">
          <Text className="review-author">Author: {review.author}</Text>
          <br />
          <br/>
          <Rate disabled defaultValue={review.rating} />
          <br />
          <Text>{review.reviewText}</Text>
          <br/>
          <br/>
          <div className="review-actions">
          
            <Button
              type="primary"
              icon={<PlusOutlined />}
                style={{
                  marginRight: "8px",
                  backgroundColor: "#1677ff",
                  borderColor: "#1677ff",
                  borderRadius: "5px",
                }}
              onClick={() => handleUpdateClick(review)}
              >
                Update
            </Button>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
                style={{
                borderRadius: "5px",
                }}
              onClick={() => handleDelete(review._id)}
              >
                 Delete
            </Button>


        </div>

        </div>
      </Card>
    ))
    
  ) : (
    <Text>You haven't written any reviews yet.</Text>
  )}
</div>

      <UpdateReviewModal
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        review={selectedReview}
        onSuccess={fetchUserReviews}
      />
      <AddReviewModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        userEmail={userEmail}
        onSuccess={fetchReviews}
      />
    </div></div>
  );
};

export default MyReviews;

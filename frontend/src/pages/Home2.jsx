import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Spin, Typography, Modal, Form, Input, Rate, message, Select, Space, Alert, Menu } from "antd";
import { LogoutOutlined, PlusOutlined, SortAscendingOutlined, SortDescendingOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import '../css/Home2.css';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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


const Home2 = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/auth/validate-token', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        } else {
          setUserEmail(null);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserEmail(null);
      }
    };

    fetchUserRole();
  }, [navigate]);

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

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const handleRatingFilter = (value) => {
    setRatingFilter(value === undefined ? null : value);
  };

  useEffect(() => {
    let filtered = [...reviews];

    if (ratingFilter !== null) {
      filtered = filtered.filter((review) => Math.floor(review.rating) === ratingFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded);
      const dateB = new Date(b.dateAdded);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredReviews(filtered);
  }, [reviews, ratingFilter, sortOrder]);

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

  return (
    <div className="home-container">
      <Navbar 
        userEmail={userEmail} 
        onLogout={logout} 
        onAddReview={() => setIsAddModalVisible(true)} 
      />
  
      <div className="content">
        {/* Filters Section */}
        <div className="filters-container">
          <Space>
            <Select
              style={{ width: 200 }}
              placeholder="Filter by Rating"
              allowClear
              onChange={handleRatingFilter}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <Option key={rating} value={rating}>
                  <Rate disabled defaultValue={rating} />
                </Option>
              ))}
            </Select>
            
            <Button 
              icon={sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
              onClick={toggleSortOrder}
            >
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
          </Space>
        </div>
  
        {/* Review List Section */}
        <div className="review-list">
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <div className="col-span-full">
              <Alert type="error" message={error} />
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <Card
                key={review._id}
                title={review.title}
                extra={<Text>{new Date(review.dateAdded).toLocaleDateString()}</Text>}
                className="review-card"
                onClick={() => navigate(`/book/${encodeURIComponent(review.title)}`)}
              >
                <div className="review-content">
                  <Text>Author: {review.author}</Text>
                  <div>
                    <Rate disabled defaultValue={review.rating} />
                  </div>
                  <Text>{review.reviewText}</Text>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Text>No reviews available.</Text>
            </div>
          )}
        </div>
      </div>
  
      <AddReviewModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        userEmail={userEmail}
        onSuccess={fetchReviews}
      />
    </div>
  );
  
  
};

export default Home2;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spin, Typography,  Rate,  Alert, Menu } from "antd";
import { LogoutOutlined, PlusOutlined, HomeOutlined, BookOutlined,EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ArrowLeftOutlined } from "@ant-design/icons";
import '../css/BookDetail.css'

const { Title, Text } = Typography;


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

const BookDetail = () => {
  const [userEmail, setUserEmail] = useState(null);
  const { bookTitle } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reviews', {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const allReviews = await response.json();
        
        // Filter reviews case-insensitively
        const matchingReviews = allReviews.filter(review => 
          review.title.toLowerCase() === bookTitle.toLowerCase()
        );
        
        setReviews(matchingReviews);
        
        // Calculate average rating
        if (matchingReviews.length > 0) {
          const totalRating = matchingReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / matchingReviews.length);
          setTotalReviews(matchingReviews.length);
        }
      } catch (error) {
        console.error('Error fetching book reviews:', error);
        setError('Failed to load book reviews');
      } finally {
        setLoading(false);
      }
    };

    if (bookTitle) {
      fetchBookReviews();
    }
  }, [bookTitle]);

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
    <div className="p-6">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        className="mb-4"
      >
        Back
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="space-y-6">
          <Card className="w-full">
            <Title level={2}>{bookTitle}</Title>
            <div className="flex items-center gap-4 mb-4">
              <Rate disabled allowHalf value={averageRating} />
              <Text>Average Rating: {averageRating.toFixed(1)} ({totalReviews} reviews)</Text>
            </div>
          </Card>

          <Title level={3}>All Reviews</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <Card key={review._id} className="w-full">
                <div className="space-y-2">
                  <Text strong>Author: {review.author}</Text>
                  <div>
                    <Rate disabled defaultValue={review.rating} />
                  </div>
                  <Text>{review.reviewText}</Text>
                  <div className="text-gray-500">
                    {new Date(review.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {reviews.length === 0 && (
            <Text>No reviews found for this book.</Text>
          )}
        </div>
        
      )}
      
    </div>
  </div>  
  );
};

export default BookDetail;
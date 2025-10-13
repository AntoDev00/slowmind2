import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const BoardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #7C9A92;
  margin-bottom: 1.5rem;
`;

const PostForm = styled.form`
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #7C9A92;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: #7C9A92;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #65807A;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Post = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fcfcfc;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7C9A92;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
`;

const Username = styled.span`
  font-weight: 600;
`;

const PostDate = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const PostContent = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #7C9A92;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CommentsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  
  &:focus {
    outline: none;
    border-color: #7C9A92;
  }
`;

const Comment = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CommentContent = styled.p`
  font-size: 0.95rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const MessageBoard = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentForms, setCommentForms] = useState({});

  // Mock data for demonstration
  const mockPosts = [
    {
      id: 1,
      content: "I've been meditating for 30 days straight and it's completely changed my perspective on stress management. Anyone else experiencing similar benefits?",
      author: {
        id: 101,
        username: "MindfulMaria"
      },
      createdAt: new Date(2025, 8, 3),
      likes: 7,
      comments: [
        {
          id: 201,
          content: "Absolutely! I've noticed better sleep and less anxiety too.",
          author: {
            id: 102,
            username: "ZenJohn"
          },
          createdAt: new Date(2025, 8, 3)
        }
      ]
    },
    {
      id: 2,
      content: "Just discovered the body scan meditation in this app and it's been a game changer for my chronic pain. Has anyone else tried this technique?",
      author: {
        id: 103,
        username: "PeacefulPaul"
      },
      createdAt: new Date(2025, 8, 2),
      likes: 5,
      comments: []
    },
    {
      id: 3,
      content: "Morning meditation vs evening meditation - which do you prefer and why?",
      author: {
        id: 104,
        username: "SereneSarah"
      },
      createdAt: new Date(2025, 8, 1),
      likes: 12,
      comments: [
        {
          id: 202,
          content: "Morning for me! Sets the tone for my whole day.",
          author: {
            id: 105,
            username: "CalmCarlos"
          },
          createdAt: new Date(2025, 8, 1)
        },
        {
          id: 203,
          content: "Evening works better with my schedule, helps me unwind after work.",
          author: {
            id: 106,
            username: "TranquilTina"
          },
          createdAt: new Date(2025, 8, 1)
        }
      ]
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from the backend
    // For now, we'll use mock data
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setSubmitting(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll just simulate adding a post
      const newPostObj = {
        id: Date.now(),
        content: newPost,
        author: {
          id: currentUser.id,
          username: currentUser.username || 'User'
        },
        createdAt: new Date(),
        likes: 0,
        comments: []
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentForms({
      ...commentForms,
      [postId]: value
    });
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentContent = commentForms[postId];
    if (!commentContent || !commentContent.trim()) return;

    // In a real implementation, this would be an API call
    const newComment = {
      id: Date.now(),
      content: commentContent,
      author: {
        id: currentUser.id,
        username: currentUser.username || 'User'
      },
      createdAt: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    // Clear the comment form
    setCommentForms({
      ...commentForms,
      [postId]: ''
    });
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <BoardContainer>
      <SectionTitle>Community Board</SectionTitle>
      
      <PostForm onSubmit={handlePostSubmit}>
        <TextArea
          placeholder="Share your meditation experience or ask the community a question..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button type="submit" disabled={submitting || !newPost.trim()}>
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </PostForm>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <PostsList>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <Post key={post.id}>
              <PostHeader>
                <UserInfo>
                  <UserAvatar>{getInitials(post.author.username)}</UserAvatar>
                  <Username>{post.author.username}</Username>
                </UserInfo>
                <PostDate>{formatDate(post.createdAt)}</PostDate>
              </PostHeader>
              
              <PostContent>{post.content}</PostContent>
              
              <PostActions>
                <ActionButton onClick={() => handleLike(post.id)}>
                  ❤️ {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                </ActionButton>
                <ActionButton>
                  💬 {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                </ActionButton>
              </PostActions>
              
              <CommentsSection>
                <CommentForm onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                  <CommentInput
                    placeholder="Add a comment..."
                    value={commentForms[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <Button type="submit" disabled={!commentForms[post.id]?.trim()}>
                    Comment
                  </Button>
                </CommentForm>
                
                {post.comments.map((comment) => (
                  <Comment key={comment.id}>
                    <CommentHeader>
                      <Username>{comment.author.username}</Username>
                      <PostDate>{formatDate(comment.createdAt)}</PostDate>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </Comment>
                ))}
              </CommentsSection>
            </Post>
          ))
        )}
      </PostsList>
    </BoardContainer>
  );
};

export default MessageBoard;

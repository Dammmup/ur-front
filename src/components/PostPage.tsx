import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Typography, List, Form, Input, Button, message, Avatar, Space, Card, Divider } from 'antd';
import UserProfileModal from './UserProfileModal';
import type { Comment, Post } from '../api';
import { getPostById, createComment, deleteComment } from '../api';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';

export const PostPage: React.FC = () => {
  const { postId } = useParams();
  const { t } = useTranslation();
  const { token, user } = useUser();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (e: any) {
        message.error(e.message || 'Error');
        navigate('/community');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId, navigate]);

  const handleAddComment = async () => {
    if (!content.trim()) return;
    if (!token) {
      message.error(t('posts.loginToComment', 'Please login'));
      return;
    }
    if (!postId) return;
    try {
      setCommentLoading(true);
      const newComment: Comment = await createComment(postId, content.trim(), token);
      setPost((prev) =>
        prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev
      );
      setContent('');
    } catch (e: any) {
      message.error(e.message || 'Error');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      await deleteComment(commentId, token);
      setPost((prev) =>
        prev ? { ...prev, comments: (prev.comments || []).filter((c) => c._id !== commentId) } : prev
      );
    } catch (e: any) {
      message.error(e.message || 'Error');
    }
  };

  if (loading) return <Spin />;
  if (!post) return null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
      <Card
        style={{ marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        
        <Space align="center" style={{ marginBottom: 24 }}>
          <Avatar src={post.author.photo} size={48}>{post.author.firstName?.charAt(0)}</Avatar>
          <div>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {post.author.firstName} {post.author.lastName}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography.Text>
          </div>
        </Space>
        <Typography.Title level={2} style={{ marginBottom: 16 }}>{post.title}</Typography.Title>

        <Typography.Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
          {post.content}
        </Typography.Paragraph>
      </Card>

      <Typography.Title level={4} style={{ marginTop: 32 }}>
        {t('posts.comments', 'Comments')}
      </Typography.Title>
      <List
        dataSource={post.comments || []}
        locale={{ emptyText: t('posts.noComments', 'No comments yet') }}
        style={{ marginBottom: 24 }}
        renderItem={(c) => (
          <List.Item
            style={{ 
              background: '#f8f8f8', 
              borderRadius: 8, 
              marginBottom: 16, 
              padding: 16,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            actions={
              (user?.id === c.author._id || ['teacher', 'admin'].includes(user?.role || '')) && token
                ? [<Button danger size="small" onClick={() => handleDeleteComment(c._id)}>{t('posts.delete', 'Delete')}</Button>]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar 
                src={c.author.photo} 
                size={40}
                style={{ cursor: 'pointer' }} 
                onClick={() => {
                  setSelectedUserId(c.author._id);
                  setModalVisible(true);
                }}
              >
                {c.author.firstName?.charAt(0)}
              </Avatar>}
              title={
                <Space align="center">
                  <Typography.Text 
                    strong 
                    style={{ fontSize: 15, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedUserId(c.author._id);
                      setModalVisible(true);
                    }}
                  >
                    {c.author.firstName} {c.author.lastName}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </Typography.Text>
                </Space>
              }
              description={
                <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                  {c.content}
                </Typography.Paragraph>
              }
            />
          </List.Item>
        )}
      />

      <Divider />
      <Form layout="vertical" style={{ marginTop: 24, marginBottom: 40 }} onFinish={handleAddComment}>
        <Form.Item label={t('posts.addComment', 'Add a comment')} required>
          <Input.TextArea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={commentLoading}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={commentLoading} 
            disabled={!token || !content.trim()}
            size="large"
          >
            {t('posts.submit', 'Submit')}
          </Button>
          {!token && (
            <Typography.Text type="secondary" style={{ marginLeft: 16 }}>
              {t('posts.loginToComment', 'Please login to comment')}
            </Typography.Text>
          )}
        </Form.Item>
      </Form>
      
      <UserProfileModal 
        userId={selectedUserId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

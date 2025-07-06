import React, { useEffect, useState } from 'react';
import { List, Typography, Button, Modal, Form, Input, message, Spin, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Post, PostCategory } from '../api';
import { getPosts, createPost } from '../api';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';

interface PostListProps {
  category: PostCategory;
}

export const PostList: React.FC<PostListProps> = ({ category }) => {
  const { user, token } = useUser();
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allowedToCreate = () => {
    if (!user) return false;
    if (category === 'question' || category === 'discussion') return true; // student+ allowed
    return user.role === 'teacher' || user.role === 'admin';
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(category);
      setPosts(data);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  const handleCreate = async (values: { title: string; content: string }) => {
    if (!token) return;
    try {
      await createPost({ ...values, category }, token);
      message.success(t('posts.created', 'Post created'));
      setIsModalOpen(false);
      loadPosts();
    } catch (e: any) {
      message.error(e.message || 'Error');
    }
  };

  if (loading) return <Spin />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      {allowedToCreate() && (
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => setIsModalOpen(true)}>
          {t('posts.create', 'Create')}
        </Button>
      )}
      <div style={{ width: '100%', textAlign: 'left' }}>
        <List
          bordered
          itemLayout="vertical"
          size="large"
          dataSource={posts}
          renderItem={(item) => (
            <List.Item key={item._id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/community/posts/${item._id}` }>
              <List.Item.Meta
                avatar={<Avatar src={item.author?.photo} size={48}>{item.author?.firstName?.charAt(0)}</Avatar>}
                title={<Typography.Title level={4} style={{ marginBottom: 0 }}>{item.title}</Typography.Title>}
                description={(
                  <>
                    <Typography.Text strong>
                      {item.author?.firstName} {item.author?.lastName}
                    </Typography.Text>
                    <br />
                    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 4 }}>
                      {item.content}
                    </Typography.Paragraph>
                    <Typography.Text type="secondary">
                      {new Date(item.createdAt).toLocaleString()}
                    </Typography.Text>
                  </>
                )}
              />
            </List.Item>
          )}
          locale={{ emptyText: t('posts.empty', 'No posts yet') }}
        />
      </div>

      <Modal
        title={t('posts.create', 'Create')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" onFinish={handleCreate} preserve={false}>
          <Form.Item name="title" label={t('posts.title', 'Title')} rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="content" label={t('posts.content', 'Content')} rules={[{ required: true }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('common.submit', 'Submit')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

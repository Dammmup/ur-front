import React from 'react';
import CommunityUsers from '../components/CommunityUsers';

const Community: React.FC = () => (
  <div style={{ padding: '48px 0', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Community</h1>
    <p style={{ color: '#888', fontSize: 18, maxWidth: 600, margin: '24px auto 0' }}>
      Join discussions, ask questions, and connect with other learners and native speakers.
    </p>
    <div style={{ marginTop: 48 }}>
      <CommunityUsers />
    </div>
    {/* TODO: Add community features here */}
  </div>
);

export default Community;

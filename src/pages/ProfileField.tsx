import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProfileFieldProps {
  label: string;
  value?: string | number;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, alignItems: 'center', mb: 2 }}>
      <Typography sx={{ fontWeight: 500, color: 'grey.700', fontSize: 16 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{value}</Typography>
    </Box>
  );
};

export default ProfileField;

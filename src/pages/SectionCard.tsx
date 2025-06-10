import React from 'react';
import { Card, CardContent, Typography, type SxProps } from '@mui/material';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  sx?: SxProps;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, sx }) => (
  <Card sx={{ maxWidth: 700, mx: 'auto', mt: 2, mb: 2, background: 'rgba(255,255,255,0.97)', borderRadius: 6, boxShadow: 3, p: { xs: 1, md: 3 }, ...sx }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);


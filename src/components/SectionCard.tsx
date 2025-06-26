import React from 'react';
import { Card, CardContent, Typography, type SxProps } from '@mui/material';
import styles from './styles/SectionCard.module.css';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  sx?: SxProps;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, sx }) => (
  <Card className={styles.card} sx={sx}>
    <CardContent className={styles.cardContent}>
      <Typography variant="h6" className={styles.title}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

import React from 'react';
import { useTranslation } from 'react-i18next';

// Material UI imports
import {
  Box, Button, Typography, IconButton, CardMedia,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemIcon, ListItemText, Link
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  TextFields as TextIcon,
  Edit as EditIcon,
  FormatQuote as QuoteIcon,
  Link as LinkIcon,
  SpaceBar as SpacerIcon,
} from '@mui/icons-material';

// Import our main editor implementation
import { MainLessonEditor } from './MainLessonEditor';

// Styles import
import styles from './styles/LessonEditor.module.css';

// Enum для типов блоков контента
export enum ContentBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
  SPACER = 'spacer',
  QUOTE = 'quote'
}

// Интерфейс для блока контента
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  order: number;
  caption?: string;
  url?: string;
  language?: string; // для блоков кода
}

export interface Course {
  _id?: string;
  name: string;
  level?: string;
  duration?: number;
  price?: number;
  description?: string;
  lessonId?: string;
}

export interface Lesson {
  _id?: string;
  title: string;
  description: string;
  contentBlocks: ContentBlock[];
  course?: string | Course;
  order?: number;
}

// Utility function to extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Tab Panel component for tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Компонент выбора типа блока контента
interface AddBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onAddBlock: (type: ContentBlockType) => void;
}

export const AddBlockDialog: React.FC<AddBlockDialogProps> = ({ open, onClose, onAddBlock }) => {
  const { t } = useTranslation();

  const blockTypes = [
    { type: ContentBlockType.TEXT, icon: <TextIcon />, label: t('lesson.textBlock') },
    { type: ContentBlockType.IMAGE, icon: <ImageIcon />, label: t('lesson.imageBlock') },
    { type: ContentBlockType.VIDEO, icon: <YouTubeIcon />, label: t('lesson.videoBlock') },
    { type: ContentBlockType.LINK, icon: <LinkIcon />, label: t('lesson.linkBlock') },
    { type: ContentBlockType.QUOTE, icon: <QuoteIcon />, label: t('lesson.quoteBlock') },
    { type: ContentBlockType.SPACER, icon: <SpacerIcon />, label: t('lesson.spacerBlock') }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth className={styles.addBlockDialog} PaperProps={{ sx: { borderRadius: 16 } }}>
      <DialogTitle>{t('lesson.addContentBlock')}</DialogTitle>
      <DialogContent>
        <List>
          {blockTypes.map((block) => (
            <ListItem
              key={block.type}
              onClick={() => {
                onAddBlock(block.type);
                onClose();
              }}
            >
              <ListItemIcon>{block.icon}</ListItemIcon>
              <ListItemText primary={block.label} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Component to render different block types
interface ContentBlockRendererProps {
  block: ContentBlock;
  onEdit: (blockId: string) => void;
  onDelete: (blockId: string) => void;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ block, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const renderBlockContent = () => {
    switch (block.type) {
      case ContentBlockType.TEXT:
        return (
          <Typography variant="body1">{block.content}</Typography>
        );
      case ContentBlockType.IMAGE:
        return (
          <Box>
            {block.url && <CardMedia component="img" className={styles.imagePreview} image={block.url} alt={block.caption || ''} />}
            {block.caption && <Typography variant="caption">{block.caption}</Typography>}
          </Box>
        );
      case ContentBlockType.VIDEO:
        const videoId = getYouTubeId(block.url || '');
        return (
          <Box>
            {videoId && (
              <Box className={styles.youtubePreview}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={block.caption || 'YouTube video'}
                  allowFullScreen
                  frameBorder="0"
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
            )}
            {block.caption && <Typography variant="caption">{block.caption}</Typography>}
          </Box>
        );
      case ContentBlockType.LINK:
        return (
          <Box>
            <Link href={block.url} target="_blank" rel="noopener noreferrer">
              {block.content || block.url}
            </Link>
            {block.caption && <Typography variant="caption">{block.caption}</Typography>}
          </Box>
        );
      case ContentBlockType.SPACER:
        return <Box className={styles.dropzone} sx={{ height: '30px' }} />;

      case ContentBlockType.QUOTE:
        return (
          <Box className={styles.quoteBlock}>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>"{block.content}"</Typography>
            {block.caption && <Typography variant="caption">{block.caption}</Typography>}
          </Box>
        );
      default:
        return <Typography>{t('lesson.unknownBlockType')}</Typography>;
    }
  };

  return (
    <Box className={styles.contentBlock}>
      <Box className={styles.blockActions}>
        <IconButton size="small" onClick={() => onEdit(block.id)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(block.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="subtitle2">
        {block.type === ContentBlockType.TEXT && <TextIcon className={styles.blockTypeIcon} />}
        {block.type === ContentBlockType.IMAGE && <ImageIcon className={styles.blockTypeIcon} />}
        {block.type === ContentBlockType.VIDEO && <YouTubeIcon className={styles.blockTypeIcon} />}
        {block.type === ContentBlockType.LINK && <LinkIcon className={styles.blockTypeIcon} />}
        {block.type === ContentBlockType.SPACER && <SpacerIcon className={styles.blockTypeIcon} />}
        {block.type === ContentBlockType.QUOTE && <QuoteIcon className={styles.blockTypeIcon} />}
        {t(`lesson.${block.type}Block`)}
      </Typography>
      <Box className={styles.blockContent}>
        {renderBlockContent()}
      </Box>
    </Box>
  );
};

// Export main component
export const LessonEditor = MainLessonEditor;
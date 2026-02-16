import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  TextFields as TextIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  Link as LinkIcon,
  FormatQuote as QuoteIcon,
  SpaceBar as SpacerIcon,
} from '@mui/icons-material';

import { ContentBlock, ContentBlockType } from './LessonEditor';
import styles from './styles/EditBlockDialog.module.css';

interface EditBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (block: ContentBlock) => void;
  block: ContentBlock | null;
}

const EditBlockDialog: React.FC<EditBlockDialogProps> = ({ open, onClose, onSave, block }) => {
  const { t } = useTranslation();

  const [editedBlock, setEditedBlock] = useState<ContentBlock>({
    id: '',
    type: ContentBlockType.TEXT,
    content: '',
    order: 0
  });

  // Reset form when block changes
  useEffect(() => {
    if (block) {
      setEditedBlock({ ...block });
    }
  }, [block]);

  const handleChange = (field: keyof ContentBlock, value: string) => {
    setEditedBlock({ ...editedBlock, [field]: value });
  };

  const handleSave = () => {
    onSave(editedBlock);
  };

  if (!block) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 16 } }}>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.blockTypeIcon}>
          {editedBlock.type === ContentBlockType.TEXT && <TextIcon />}
          {editedBlock.type === ContentBlockType.IMAGE && <ImageIcon />}
          {editedBlock.type === ContentBlockType.VIDEO && <YouTubeIcon />}
          {editedBlock.type === ContentBlockType.LINK && <LinkIcon />}
          {editedBlock.type === ContentBlockType.QUOTE && <QuoteIcon />}
          {editedBlock.type === ContentBlockType.SPACER && <SpacerIcon />}
        </span>
        {t(`lesson.edit${editedBlock.type.charAt(0).toUpperCase() + editedBlock.type.slice(1)}Block`)}
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {(editedBlock.type === ContentBlockType.TEXT || editedBlock.type === ContentBlockType.QUOTE) && (
          <div className={styles.formField}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label={t('lesson.content')}
              value={editedBlock.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={styles.formTextArea}
            />
          </div>
        )}

        {editedBlock.type === ContentBlockType.IMAGE && (
          <>
            <div className={styles.formField}>
              <TextField
                fullWidth
                label={t('lesson.imageUrl')}
                value={editedBlock.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className={styles.formInput}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {editedBlock.url && (
              <Box className={styles.imagePreview}>
                <img
                  src={editedBlock.url}
                  alt={t('lesson.imagePreview')}
                />
              </Box>
            )}
          </>
        )}

        {editedBlock.type === ContentBlockType.VIDEO && (
          <div className={styles.formField}>
            <TextField
              fullWidth
              label={t('lesson.videoUrl')}
              value={editedBlock.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              className={styles.formInput}
              placeholder="https://www.youtube.com/watch?v=..."
              helperText={t('lesson.youtubeUrlHelp')}
            />
            <span className={styles.helpText}>{t('lesson.youtubeUrlHelp')}</span>
          </div>
        )}

        {editedBlock.type === ContentBlockType.LINK && (
          <>
            <div className={styles.formField}>
              <TextField
                fullWidth
                label={t('lesson.linkUrl')}
                value={editedBlock.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className={styles.formInput}
                placeholder="https://example.com"
              />
            </div>
            <div className={styles.formField}>
              <TextField
                fullWidth
                label={t('lesson.linkText')}
                value={editedBlock.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className={styles.formInput}
                placeholder={t('lesson.linkTextPlaceholder')}
              />
            </div>
          </>
        )}

        {(editedBlock.type === ContentBlockType.IMAGE ||
          editedBlock.type === ContentBlockType.VIDEO ||
          editedBlock.type === ContentBlockType.QUOTE) && (
            <div className={styles.formField}>
              <TextField
                fullWidth
                label={t('lesson.caption')}
                value={editedBlock.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
                className={styles.formInput}
              />
            </div>
          )}
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} className={styles.cancelButton}>{t('common.cancel')}</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          className={styles.saveButton}
          disabled={
            (editedBlock.type === ContentBlockType.TEXT && !editedBlock.content) ||
            ((editedBlock.type === ContentBlockType.IMAGE ||
              editedBlock.type === ContentBlockType.VIDEO ||
              editedBlock.type === ContentBlockType.LINK) && !editedBlock.url)
          }
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBlockDialog;

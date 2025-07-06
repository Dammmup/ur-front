import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';

import {  ContentBlock, ContentBlockType } from './LessonEditor';

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t(`lesson.edit${editedBlock.type.charAt(0).toUpperCase() + editedBlock.type.slice(1)}Block`)}
      </DialogTitle>
      <DialogContent>
        {(editedBlock.type === ContentBlockType.TEXT || editedBlock.type === ContentBlockType.QUOTE) && (
          <TextField
            fullWidth
            multiline
            rows={5}
            label={t('lesson.content')}
            value={editedBlock.content}
            onChange={(e) => handleChange('content', e.target.value)}
            margin="normal"
          />
        )}
        
        {editedBlock.type === ContentBlockType.IMAGE && (
          <>
            <TextField
              fullWidth
              label={t('lesson.imageUrl')}
              value={editedBlock.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              margin="normal"
              placeholder="https://example.com/image.jpg"
            />
            {editedBlock.url && (
              <Box sx={{ mt: 2, mb: 2, maxHeight: '200px', overflow: 'hidden', textAlign: 'center' }}>
                <img 
                  src={editedBlock.url} 
                  alt={t('lesson.imagePreview')} 
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                />
              </Box>
            )}
          </>
        )}
        
        {editedBlock.type === ContentBlockType.VIDEO && (
          <TextField
            fullWidth
            label={t('lesson.videoUrl')}
            value={editedBlock.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            margin="normal"
            placeholder="https://www.youtube.com/watch?v=..."
            helperText={t('lesson.youtubeUrlHelp')}
          />
        )}
        
        {editedBlock.type === ContentBlockType.LINK && (
          <>
            <TextField
              fullWidth
              label={t('lesson.linkUrl')}
              value={editedBlock.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              margin="normal"
              placeholder="https://example.com"
            />
            <TextField
              fullWidth
              label={t('lesson.linkText')}
              value={editedBlock.content}
              onChange={(e) => handleChange('content', e.target.value)}
              margin="normal"
              placeholder={t('lesson.linkTextPlaceholder')}
            />
          </>
        )}
        
        {(editedBlock.type === ContentBlockType.IMAGE || 
          editedBlock.type === ContentBlockType.VIDEO || 
          editedBlock.type === ContentBlockType.QUOTE) && (
          <TextField
            fullWidth
            label={t('lesson.caption')}
            value={editedBlock.caption || ''}
            onChange={(e) => handleChange('caption', e.target.value)}
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
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

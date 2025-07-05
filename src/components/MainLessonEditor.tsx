import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd';

// Material UI imports
import {
  Box, Button, Container, TextField, Typography, 
  Tab, Tabs, Paper, CircularProgress, Alert,
  Fab, Link
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

// API imports
import { getLesson, updateLesson, createLesson } from '../api';
import { useUser } from '../UserContext';
import EditBlockDialog from './EditBlockDialog';

// Import from LessonEditor.tsx
import { type ContentBlock, ContentBlockType, TabPanel, AddBlockDialog, ContentBlockRenderer } from './LessonEditor';

// Styles import
import './styles/LessonEditor.module.css';

// Main LessonEditor component
interface MainLessonEditorProps {}

export const MainLessonEditor: React.FC<MainLessonEditorProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  
  // Определяем, создаем ли мы новый урок
  const queryParams = new URLSearchParams(location.search);
  const isNew = queryParams.get('new') === 'true';
  
  // State for lesson data
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState<boolean>(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  
  // Helper function to get YouTube ID
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Очищаем courseId при монтировании компонента, чтобы не использовались предыдущие значения
  useEffect(() => {
    console.log('[MainLessonEditor] Component mounted, resetting courseId');
    setCourseId(''); // Очищаем значение courseId при монтировании
  }, []);

  // Load lesson data if editing
  useEffect(() => {
    // Получаем courseId из URL параметров при создании нового урока
    if (isNew) {
      // ВАЖНО: получаем courseId из URL параметров
      const courseIdParam = queryParams.get('courseId');
      console.log(`[MainLessonEditor] Extracted courseId from URL parameters: ${courseIdParam}`);
      
      if (courseIdParam) {
        // Проверяем формат MongoDB ID (24 символа в hex)
        const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(courseIdParam);
        
        if (!isValidMongoId) {
          console.error(`[MainLessonEditor] Invalid MongoDB ID format for courseId: ${courseIdParam}`);
          setError('Invalid course ID format. Cannot create lesson.');
          setLoading(false);
          return;
        }
        
        // Проверяем, что courseId не совпадает с lessonId
        if (courseIdParam === lessonId) {
          console.error(`[MainLessonEditor] Error: courseId (${courseIdParam}) is the same as lessonId!`);
          setError('Internal error: Course ID is invalid (same as lesson ID)');
          setLoading(false);
          return;
        }
        
        // Устанавливаем courseId в состояние и сохраняем в localStorage
        setCourseId(String(courseIdParam));
        localStorage.setItem('lastUsedCourseId', courseIdParam); // Сохраняем в localStorage для отладки
        console.log(`[MainLessonEditor] Set courseId state to: ${courseIdParam} and saved to localStorage`);
        setLoading(false);
        return;
      } else {
        console.error('[MainLessonEditor] No courseId provided in URL parameters');
        setError('Course ID is missing. Cannot create lesson.');
        setLoading(false);
        return;
      }
    }
    
    if (lessonId && !isNew) {
      setLoading(true);
      console.log(`[MainLessonEditor] Loading lesson data for ID: ${lessonId}`);
      
      getLesson(lessonId)
        .then(data => {
          if (data) {
            console.log('[MainLessonEditor] Lesson data received:', data);
            setTitle(data.title || '');
            setDescription(data.content2 || '');
            
            // ВАЖНО: устанавливаем courseId из data.course только если редактируем существующий урок,
            // а не создаем новый (при создании нового courseId уже установлен из URL параметров)
            if (!isNew) {
              // Если редактируем существующий урок, берем course из данных урока
              // backend может вернуть поле course как строку ObjectID или объект курса (если populate)
              const extractedCourseId = typeof data.course === 'string' ? data.course : (data.course && (data.course as any)._id) || '';
              setCourseId(extractedCourseId);
              console.log(`[MainLessonEditor] Setting courseId from lesson data: ${data.course}`);
            } else {
              // Если создаем новый урок, не трогаем courseId, он уже должен быть установлен из URL
              console.log(`[MainLessonEditor] Creating new lesson, keeping courseId from URL: ${courseId}`);
            }
            
            // Парсим содержимое content, где хранятся блоки контента
            try {
              if (data.content) {
                const parsedContent = JSON.parse(data.content);
                if (Array.isArray(parsedContent)) {
                  const blocks = parsedContent.map((block: any, index: number) => ({
                    ...block,
                    id: block.id || uuidv4(),
                    order: block.order || index
                  }));
                  setContentBlocks(blocks.sort((a: ContentBlock, b: ContentBlock) => a.order - b.order));
                } else {
                  // Если content не массив, инициализируем пустым массивом
                  setContentBlocks([]);
                }
              } else {
                // Если content отсутствует, инициализируем пустым массивом
                setContentBlocks([]);
              }
            } catch (err) {
              console.error('[MainLessonEditor] Error parsing content JSON:', err);
              setContentBlocks([]);
            }
          }
        })
        .catch(err => {
          console.error('Failed to load lesson:', err);
          setError(t('lesson.errorLoading'));
        })
        .finally(() => setLoading(false));
    }
  }, [lessonId, t]);
  
  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Add new content block
  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type,
      content: '',
      order: contentBlocks.length
    };
    
    setContentBlocks([...contentBlocks, newBlock]);
    setEditingBlock(newBlock);
    setEditDialogOpen(true);
  };
  
  // Delete content block
  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = contentBlocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));
    setContentBlocks(updatedBlocks);
  };
  
  // Edit content block
  const handleEditBlock = (blockId: string) => {
    const blockToEdit = contentBlocks.find(block => block.id === blockId);
    if (blockToEdit) {
      setEditingBlock(blockToEdit);
      setEditDialogOpen(true);
    }
  };
  
  // Update block after editing
  const handleSaveEditingBlock = (updatedBlock: ContentBlock) => {
    const updatedBlocks = contentBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    );
    setContentBlocks(updatedBlocks);
    setEditingBlock(null);
    setEditDialogOpen(false);
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(contentBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each item
    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    
    setContentBlocks(updatedItems);
  };
  
  // Save lesson
  const handleSave = async () => {
    if (!title) {
      setError(t('lesson.titleRequired'));
      return;
    }
    
    if (!courseId) {
      setError(t('lesson.courseRequired') || 'Course ID is required');
      console.error('[MainLessonEditor] Course ID is missing');
      return;
    }
    
    console.log(`[MainLessonEditor] Current lessonId param: ${lessonId}`);
    console.log(`[MainLessonEditor] Current courseId param: ${courseId}`);

    // Проверка наличия заголовка урока
    if (!title.trim()) {
      setError(t('lesson.titleRequired'));
      return;
    }

    // КРИТИЧЕСКАЯ ПРОВЕРКА: courseId и lessonId НИКОГДА не должны совпадать
    // courseId - это MongoDB ObjectID родительского курса
    // lessonId - это либо UUID для нового урока, либо MongoDB ObjectID существующего урока
    if (courseId === lessonId) {
      console.error('[MainLessonEditor] КРИТИЧЕСКАЯ ОШИБКА: courseId и lessonId совпадают!');
      console.error(`[MainLessonEditor] courseId: ${courseId}, lessonId: ${lessonId}`);
      setError('Внутренняя ошибка: ID курса и ID урока совпадают');
      return;
    }
    
    // Преобразуем contentBlocks в строку JSON для хранения в поле content
    // и обеспечиваем совместимость с моделью урока на бэкенде
    const sanitizedBlocks = contentBlocks.map(block => ({
      ...block,
      content: (block.content && block.content.trim() !== '') ? block.content : '-', // заменяем undefined/null на пустую строку
    }));
    const content = JSON.stringify(sanitizedBlocks);
    
    // Обязательная проверка courseId на формат MongoDB ID (24 символа в hex)
    // COURSE_ID - это МОНГО АЙДИ родительского курса
    console.log(`[MainLessonEditor] Проверка COURSE_ID для создания урока: ${courseId}`);
    
    const isValidMongoId = courseId && /^[0-9a-fA-F]{24}$/.test(courseId);
    
    if (!isValidMongoId) {
      console.error(`[MainLessonEditor] Неверный формат MongoDB ID для COURSE_ID: ${courseId}`);  
      setError('Неверный формат ID курса. Невозможно создать урок.');
      return;
    }
    
    // Подготавливаем данные в формате, соответствующем модели на бэкенде

    const lessonData = {
      title,
      content,              // сериализованные блоки контента
      content2: description, // используем content2 для описания
      course: courseId,     // ID связанного курса
      // Добавляем дополнительные поля если они нужны для модели на бэкенде
      image: '',
      image2: '',
      linkonyoutube: '',
      order: 0
    };
    
    console.log('[MainLessonEditor] Preparing lesson data:', lessonData);
    console.log(`[MainLessonEditor] Course ID being sent: ${lessonData.course}`);  
    
    setSaving(true);
    setError(null);
    
    try {
      // Получаем токен авторизации из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError(t('common.authError'));
        setSaving(false);
        return;
      }
      
      console.log('[MainLessonEditor] Using token for API call:', token.substring(0, 15) + '...');
      
      if (lessonId && !isNew) {
        console.log(`[MainLessonEditor] Updating lesson with ID: ${lessonId}`);
        const result = await updateLesson(lessonId, lessonData, token);
        console.log('[MainLessonEditor] Update result:', result);
        setSuccess(t('lesson.updateSuccess'));
        // После успешного обновления, остаемся на этой же странице
      } else {
        console.log('[MainLessonEditor] Creating new lesson');
        const result = await createLesson(lessonData, token);
        console.log('[MainLessonEditor] Create result:', result);
        setSuccess(t('lesson.createSuccess'));
        // После создания нового урока, возвращаемся на страницу курса
        if (courseId) {
          navigate(`/course/${courseId}`);
        }
      }
    } catch (err) {
      console.error('Failed to save lesson:', err);
      setError(t('lesson.saveError'));
    } finally {
      setSaving(false);
    }
  };
  
  // Check if user has edit permissions
  const canEdit = user && (user.role === 'admin' || user.role === 'teacher');
  
  if (!canEdit) {
    return (
      <Container className='container'>
        <Alert severity="error">{t('common.unauthorized')}</Alert>
      </Container>
    );
  }
  
  if (loading) {
    return (
      <Container className='container' sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container className='container'>
      <Box className='header'>
        <Typography variant="h4">
          {lessonId ? t('lesson.editTitle') : t('lesson.createTitle')}
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Tabs value={tabValue} onChange={handleTabChange} className='tabs'>
        <Tab label={t('lesson.editTab')} />
        <Tab label={t('lesson.previewTab')} />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <Box className='formContainer'>
          <TextField
            fullWidth
            label={t('lesson.titleField')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            error={!title}
            helperText={!title ? t('lesson.titleRequired') : ''}
          />
          
          <TextField
            fullWidth
            label={t('lesson.descriptionField')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            {t('lesson.contentBlocks')}
          </Typography>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="content-blocks">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='contentBlocks'
                >
                  {contentBlocks.length === 0 ? (
                    <Paper 
                      elevation={0} 
                      sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}
                    >
                      {t('lesson.noBlocks')}
                    </Paper>
                  ) : (
                    contentBlocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className='draggableBlock'
                          >
                            <Paper elevation={1} className='blockPaper'>
                              <Box 
                                {...provided.dragHandleProps}
                                className='dragHandle'
                              >
                                <DragIcon />
                              </Box>
                              
                              <ContentBlockRenderer
                                block={block}
                                onEdit={handleEditBlock}
                                onDelete={handleDeleteBlock}
                              />
                            </Paper>
                          </Box>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          
          <Box className='addBlockButton'>
            <Fab 
              color="primary" 
              variant="extended" 
              onClick={() => setAddBlockDialogOpen(true)}
            >
              <AddIcon sx={{ mr: 1 }} />
              {t('lesson.addBlock')}
            </Fab>
          </Box>
          
          <Box className='formActions'>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />} 
              disabled={saving} 
              onClick={handleSave}
            >
              {saving ? t('common.saving') : t('common.save')}
              {saving && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Paper className='previewContainer' elevation={1}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{description}</Typography>
          
          {contentBlocks.map((block) => (
            <Box key={block.id} sx={{ mb: 3 }}>
              {block.type === ContentBlockType.TEXT && (
                <Typography variant="body1">{block.content}</Typography>
              )}
              {block.type === ContentBlockType.IMAGE && block.url && (
                <>
                  <Box component="img" src={block.url} alt={block.caption || ''} className='imagePreview' />
                  {block.caption && <Typography variant="caption" display="block">{block.caption}</Typography>}
                </>
              )}
              {block.type === ContentBlockType.VIDEO && block.url && (() => {
                const videoId = getYouTubeId(block.url || '');
                return videoId ? (
                  <>
                    <Box className='videoContainer'>
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={block.caption || 'YouTube video'}
                        allowFullScreen
                        frameBorder="0"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                    {block.caption && <Typography variant="caption" display="block">{block.caption}</Typography>}
                  </>
                ) : null;
              })()}
              {block.type === ContentBlockType.LINK && block.url && (
                <Link href={block.url} target="_blank" rel="noopener noreferrer">
                  {block.content || block.url}
                </Link>
              )}
              {block.type === ContentBlockType.SPACER && (
                <Box className='spacerBlock' />
              )}
              {block.type === ContentBlockType.QUOTE && (
                <Box className='quoteBlock'>
                  <Typography variant="body1" style={{ fontStyle: 'italic' }}>"{block.content}"</Typography>
                  {block.caption && <Typography variant="caption" display="block">{block.caption}</Typography>}
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      </TabPanel>
      
      <AddBlockDialog
        open={addBlockDialogOpen}
        onClose={() => setAddBlockDialogOpen(false)}
        onAddBlock={handleAddBlock}
      />

      {editingBlock && (
        <EditBlockDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEditingBlock}
          block={editingBlock}
          />
        )}
      </Container>
    );
  };

export default MainLessonEditor;
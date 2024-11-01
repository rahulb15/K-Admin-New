// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   IconButton,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   CircularProgress,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Fab,
//   Tooltip
// } from '@mui/material';
// import {
//   Edit,
//   Delete,
//   Add,
//   ExpandMore,
//   Article as ArticleIcon,
//   Category as CategoryIcon
// } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import axios from 'axios';

// // Form validation schemas
// const categorySchema = yup.object().shape({
//   title: yup.string().required('Title is required'),
//   slug: yup.string()
// });

// const articleSchema = yup.object().shape({
//   title: yup.string().required('Title is required'),
//   content: yup.string().required('Content is required'),
//   subCategoryTitle: yup.string().required('Subcategory is required')
// });

// const CategoryDialog = ({ open, handleClose, onSubmit, initialData = {} }) => {
//   const { control, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: yupResolver(categorySchema),
//     defaultValues: initialData
//   });

//   useEffect(() => {
//     reset(initialData);
//   }, [initialData]);

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         {initialData?._id ? 'Edit Category' : 'Create Category'}
//       </DialogTitle>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent>
//           <Controller
//             name="title"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Title"
//                 fullWidth
//                 margin="normal"
//                 error={!!errors.title}
//                 helperText={errors.title?.message}
//               />
//             )}
//           />
//           <Controller
//             name="slug"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Slug (optional)"
//                 fullWidth
//                 margin="normal"
//                 helperText="Leave empty to auto-generate from title"
//               />
//             )}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button type="submit" variant="contained" color="primary">
//             {initialData?._id ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// const ArticleDialog = ({ open, handleClose, onSubmit, categories, initialData = {} }) => {
//   const { control, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: yupResolver(articleSchema),
//     defaultValues: initialData
//   });

//   useEffect(() => {
//     reset(initialData);
//   }, [initialData]);

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         {initialData?._id ? 'Edit Article' : 'Create Article'}
//       </DialogTitle>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent>
//           <Controller
//             name="categoryId"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 select
//                 label="Category"
//                 fullWidth
//                 margin="normal"
//                 error={!!errors.categoryId}
//                 helperText={errors.categoryId?.message}
//                 SelectProps={{ native: true }}
//               >
//                 <option value="">Select Category</option>
//                 {categories?.map(category => (
//                   <option key={category?._id} value={category?._id}>
//                     {category?.title}
//                   </option>
//                 ))}
//               </TextField>
//             )}
//           />
//           <Controller
//             name="subCategoryTitle"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Subcategory Title"
//                 fullWidth
//                 margin="normal"
//                 error={!!errors.subCategoryTitle}
//                 helperText={errors.subCategoryTitle?.message}
//               />
//             )}
//           />
//           <Controller
//             name="title"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Article Title"
//                 fullWidth
//                 margin="normal"
//                 error={!!errors.title}
//                 helperText={errors.title?.message}
//               />
//             )}
//           />
//           <Controller
//             name="content"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Content"
//                 fullWidth
//                 multiline
//                 rows={6}
//                 margin="normal"
//                 error={!!errors.content}
//                 helperText={errors.content?.message}
//               />
//             )}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button type="submit" variant="contained" color="primary">
//             {initialData?._id ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// export default function SupportManager() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
//   const [articleDialogOpen, setArticleDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedArticle, setSelectedArticle] = useState(null);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/api/v1/support/categories');
//       console.log('Categories:', response);
//       if (response.data.status === 'success') {
//         setCategories(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleCreateCategory = async (data) => {
//     try {
//       await axios.post('http://localhost:5000/api/v1/support/category', data);
//       fetchCategories();
//       setCategoryDialogOpen(false);
//     } catch (error) {
//       console.error('Error creating category:', error);
//     }
//   };

//   const handleCreateArticle = async (data) => {
//     try {
//       await axios.post('http://localhost:5000/api/v1/support/article', data);
//       fetchCategories();
//       setArticleDialogOpen(false);
//     } catch (error) {
//       console.error('Error creating article:', error);
//     }
//   };

//   const handleUpdateArticle = async (data) => {
//     try {
//       await axios.put('http://localhost:5000/api/v1/support/article', {
//         categoryId: data.categoryId,
//         subCategoryTitle: data.subCategoryTitle,
//         articleSlug: selectedArticle.slug,
//         updates: {
//           title: data.title,
//           content: data.content
//         }
//       });
//       fetchCategories();
//       setArticleDialogOpen(false);
//       setSelectedArticle(null);
//     } catch (error) {
//       console.error('Error updating article:', error);
//     }
//   };

//   return (
//     <Box p={3}>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Card>
//             <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h5">Support Categories & Articles</Typography>
//               <Box>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<CategoryIcon />}
//                   onClick={() => setCategoryDialogOpen(true)}
//                   sx={{ mr: 1 }}
//                 >
//                   New Category
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   startIcon={<ArticleIcon />}
//                   onClick={() => setArticleDialogOpen(true)}
//                 >
//                   New Article
//                 </Button>
//               </Box>
//             </Box>

//             {loading ? (
//               <Box display="flex" justifyContent="center" p={3}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <Box p={2}>
//                 {categories?.map(category => (
//                   <Accordion key={category?._id}>
//                     <AccordionSummary expandIcon={<ExpandMore />}>
//                       <Box display="flex" alignItems="center" width="100%">
//                         <CategoryIcon sx={{ mr: 1 }} />
//                         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                           {category?.title}
//                         </Typography>
//                         <Typography color="textSecondary" sx={{ mr: 2 }}>
//                           {category?.articleCount} articles
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedCategory(category);
//                             setCategoryDialogOpen(true);
//                           }}
//                         >
//                           <Edit />
//                         </IconButton>
//                       </Box>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       {category?.subCategories?.map(subCategory => (
//                         <Box key={subCategory?._id} mb={2}>
//                           <Typography variant="subtitle1" fontWeight="bold">
//                             {subCategory?.title}
//                           </Typography>
//                           <Table size="small">
//                             <TableBody>
//                               {subCategory?.articles?.map(article => (
//                                 <TableRow key={article?._id}>
//                                   <TableCell>{article?.title}</TableCell>
//                                   <TableCell align="right">
//                                     <IconButton
//                                       size="small"
//                                       onClick={() => {
//                                         setSelectedArticle({
//                                           ...article,
//                                           categoryId: category?._id,
//                                           subCategoryTitle: subCategory?.title
//                                         });
//                                         setArticleDialogOpen(true);
//                                       }}
//                                     >
//                                       <Edit />
//                                     </IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </Box>
//                       ))}
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Box>
//             )}
//           </Card>
//         </Grid>
//       </Grid>

//       <CategoryDialog
//         open={categoryDialogOpen}
//         handleClose={() => {
//           setCategoryDialogOpen(false);
//           setSelectedCategory(null);
//         }}
//         onSubmit={handleCreateCategory}
//         initialData={selectedCategory}
//       />

//       <ArticleDialog
//         open={articleDialogOpen}
//         handleClose={() => {
//           setArticleDialogOpen(false);
//           setSelectedArticle(null);
//         }}
//         onSubmit={selectedArticle ? handleUpdateArticle : handleCreateArticle}
//         categories={categories}
//         initialData={selectedArticle}
//       />
//     </Box>
//   );
// }



import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  ExpandMore,
  Article as ArticleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// Updated article schema to match your API structure
const articleSchema = yup.object().shape({
  categoryId: yup.string().required('Category is required'),
  subCategoryTitle: yup.string().required('Subcategory is required'),
  article: yup.object().shape({
    title: yup.string().required('Title is required'),
    slug: yup.string(),
    content: yup.string().required('Content is required')
  })
});

const categorySchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string(),
  icon: yup
    .mixed()
    .nullable()
    .test('fileSize', 'File too large. Max size is 2MB.', (value) => {
      if (!value || !value[0]) return true; // Pass validation if no file
      return value[0].size <= 2 * 1024 * 1024; // 2MB limit
    })
    .test('fileType', 'Unsupported file type. Only images allowed.', (value) => {
      if (!value || !value[0]) return true; // Pass validation if no file
      return value[0].type && value[0].type.startsWith('image/');
    })
});

const CategoryDialog = ({ open, handleClose, onSubmit, initialData = {} }) => {
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      icon: null // Initialize icon as null
    }
  });

  const [iconPreview, setIconPreview] = useState(initialData?.icon || null);
  const iconFile = watch('icon');

  useEffect(() => {
    reset({
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      icon: null // Reset icon to null when initialData changes
    });
    // Set initial preview if there's an existing icon URL
    setIconPreview(initialData?.icon || null);
  }, [initialData, reset]);

  // Generate preview when new icon file is selected
  useEffect(() => {
    if (iconFile && iconFile[0] instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(iconFile[0]);
    }
  }, [iconFile]);

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.slug) {
        formData.append('slug', data.slug);
      }
      if (data.icon?.[0] instanceof Blob) {
        formData.append('icon', data.icon[0]);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData?._id ? 'Edit Category' : 'Create Category'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug (optional)"
                fullWidth
                margin="normal"
                helperText="Leave empty to auto-generate from title"
              />
            )}
          />

          <Controller
            name="icon"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Box>
                <TextField
                  {...field}
                  type="file"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  label="Category Icon"
                  inputProps={{
                    accept: 'image/*',
                  }}
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  error={!!errors.icon}
                  helperText={errors.icon?.message || 'Upload an icon (max 2MB)'}
                />
                {iconPreview && (
                  <Box mt={2} display="flex" justifyContent="center" position="relative">
                    <Box
                      component="img"
                      src={iconPreview}
                      alt="Icon preview"
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid #ccc'
                      }}
                    />
                    {/* Add delete icon button if needed */}
                  </Box>
                )}
              </Box>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData?._id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


const ArticleDialog = ({ open, handleClose, onSubmit, categories, initialData = {} }) => {
  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
      subCategoryTitle: initialData?.subCategoryTitle || '',
      article: {
        title: initialData?.article?.title || '',
        slug: initialData?.article?.slug || '',
        content: initialData?.article?.content || ''
      }
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        categoryId: initialData?.categoryId || '',
        subCategoryTitle: initialData?.subCategoryTitle || '',
        article: {
          title: initialData?.article?.title || '',
          slug: initialData?.article?.slug || '',
          content: initialData?.article?.content || ''
        }
      });
    }
  }, [initialData, reset]);

  // Auto-generate slug from title
  const articleTitle = watch('article.title');
  useEffect(() => {
    if (articleTitle && !watch('article.slug')) {
      setValue(
        'article.slug',
        articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      );
    }
  }, [articleTitle, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?._id ? 'Edit Article' : 'Create Article'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                margin="normal"
                error={!!errors.categoryId}
                helperText={errors.categoryId?.message}
                SelectProps={{ native: true }}
              >
                <option value="">Select Category</option>
                {categories?.map(category => (
                  <option key={category?._id} value={category?._id}>
                    {category?.title}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="subCategoryTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subcategory Title"
                fullWidth
                margin="normal"
                error={!!errors.subCategoryTitle}
                helperText={errors.subCategoryTitle?.message}
              />
            )}
          />
          <Controller
            name="article.title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Article Title"
                fullWidth
                margin="normal"
                error={!!errors.article?.title}
                helperText={errors.article?.title?.message}
              />
            )}
          />
          <Controller
            name="article.slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug (auto-generated)"
                fullWidth
                margin="normal"
                error={!!errors.article?.slug}
                helperText={errors.article?.slug?.message}
              />
            )}
          />
          <Controller
            name="article.content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Content (HTML)"
                fullWidth
                multiline
                rows={8}
                margin="normal"
                error={!!errors.article?.content}
                helperText={errors.article?.content?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData?._id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default function SupportManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/support/categories');
      if (response.data.status === 'success') {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const handleCreateCategory = async (data) => {
  //   try {
  //     await axios.post('http://localhost:5000/api/v1/support/category', data);
  //     fetchCategories();
  //     setCategoryDialogOpen(false);
  //   } catch (error) {
  //     console.error('Error creating category:', error);
  //   }
  // };

  const handleCreateCategory = async (formData) => {
    try {
      const url = selectedCategory 
        ? `http://localhost:5000/api/v1/support/category/${selectedCategory._id}`
        : 'http://localhost:5000/api/v1/support/category';
      
      const method = selectedCategory ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.status === 'success') {
        fetchCategories();
        setCategoryDialogOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error creating/updating category:', error);
    }
  };

  const handleCreateArticle = async (data) => {
    try {
      // Data is already in the correct format due to the updated form structure
      await axios.post('http://localhost:5000/api/v1/support/article', data);
      fetchCategories();
      setArticleDialogOpen(false);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleUpdateArticle = async (data) => {
    try {
      await axios.put('http://localhost:5000/api/v1/support/article', {
        categoryId: data.categoryId,
        subCategoryTitle: data.subCategoryTitle,
        articleSlug: selectedArticle.article.slug,
        updates: {
          title: data.article.title,
          slug: data.article.slug,
          content: data.article.content
        }
      });
      fetchCategories();
      setArticleDialogOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Support Categories & Articles</Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CategoryIcon />}
                  onClick={() => setCategoryDialogOpen(true)}
                  sx={{ mr: 1 }}
                >
                  New Category
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArticleIcon />}
                  onClick={() => setArticleDialogOpen(true)}
                >
                  New Article
                </Button>
              </Box>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box p={2}>
                {categories?.map(category => (
                  <Accordion key={category?._id}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" width="100%">
                        <CategoryIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {category?.title}
                        </Typography>
                        <Typography color="textSecondary" sx={{ mr: 2 }}>
                          {category?.articleCount} articles
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(category);
                            setCategoryDialogOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {category?.subCategories?.map(subCategory => (
                        <Box key={subCategory?.title} mb={2}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {subCategory?.title}
                          </Typography>
                          <Table size="small">
                            <TableBody>
                              {subCategory?.articles.map(article => (
                                <TableRow key={article?.slug}>
                                  <TableCell>{article?.title}</TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedArticle({
                                          categoryId: category?._id,
                                          subCategoryTitle: subCategory?.title,
                                          article: article
                                        });
                                        setArticleDialogOpen(true);
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <CategoryDialog
        open={categoryDialogOpen}
        handleClose={() => {
          setCategoryDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleCreateCategory}
        initialData={selectedCategory}
      />

      <ArticleDialog
        open={articleDialogOpen}
        handleClose={() => {
          setArticleDialogOpen(false);
          setSelectedArticle(null);
        }}
        onSubmit={selectedArticle ? handleUpdateArticle : handleCreateArticle}
        categories={categories}
        initialData={selectedArticle}
      />
    </Box>
  );
}
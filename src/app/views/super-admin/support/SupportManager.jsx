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

import React, { useState, useEffect, useCallback } from "react";
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
  Snackbar,
  Alert,
  LinearProgress,
  Paper,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ExpandMore,
  Article as ArticleIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import * as yup from "yup";

// Custom hook for notifications
const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = useCallback((message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return { notification, showNotification, hideNotification };
};

// Updated article schema to match your API structure
const articleSchema = yup.object().shape({
  categoryId: yup.string().required("Category is required"),
  subCategoryTitle: yup.string().required("Subcategory is required"),
  article: yup.object().shape({
    title: yup.string().required("Title is required"),
    slug: yup.string(),
    content: yup.string().required("Content is required"),
  }),
});

const categorySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  slug: yup.string(),
  icon: yup
    .mixed()
    .nullable()
    .test("fileSize", "File too large. Max size is 2MB.", (value) => {
      if (!value || !value[0]) return true; // Pass validation if no file
      return value[0].size <= 2 * 1024 * 1024; // 2MB limit
    })
    .test(
      "fileType",
      "Unsupported file type. Only images allowed.",
      (value) => {
        if (!value || !value[0]) return true; // Pass validation if no file
        return value[0].type && value[0].type.startsWith("image/");
      }
    ),
});

const CategoryDialog = ({ open, handleClose, onSubmit, initialData = {} }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      icon: null, // Initialize icon as null
    },
  });

  const [iconPreview, setIconPreview] = useState(initialData?.icon || null);
  const iconFile = watch("icon");

  useEffect(() => {
    reset({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      icon: null, // Reset icon to null when initialData changes
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
      formData.append("title", data.title);
      if (data.slug) {
        formData.append("slug", data.slug);
      }
      if (data.icon?.[0] instanceof Blob) {
        formData.append("icon", data.icon[0]);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData?._id ? "Edit Category" : "Create Category"}
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
                    accept: "image/*",
                  }}
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  error={!!errors.icon}
                  helperText={
                    errors.icon?.message || "Upload an icon (max 2MB)"
                  }
                />
                {iconPreview && (
                  <Box
                    mt={2}
                    display="flex"
                    justifyContent="center"
                    position="relative"
                  >
                    <Box
                      component="img"
                      src={iconPreview}
                      alt="Icon preview"
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid #ccc",
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
            {initialData?._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Notification = ({ open, message, severity, onClose }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);


// ArticleDialog.jsx
const ArticleDialog = ({
  open,
  handleClose,
  onSubmit,
  categories,
  initialData = {},
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: {
      categoryId: "",
      subCategoryTitle: "",
      article: {
        title: "",
        slug: "",
        content: "",
      },
    },
  });

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );


  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log("Setting initial data:", initialData);

      // Reset form with initial data
      reset({
        categoryId: initialData.categoryId || "",
        subCategoryTitle: initialData.subCategoryTitle || "",
        article: {
          title: initialData.article?.title || "",
          slug: initialData.article?.slug || "",
          content: initialData.article?.content || "",
        },
      });

      // Initialize editor with content if it exists
      if (initialData.article?.content) {
        const blocksFromHTML = convertFromHTML(initialData.article.content);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [initialData, reset]);

  // Handle editor state changes
  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    // Convert editor content to HTML and update form
    const html = stateToHTML(newState.getCurrentContent());
    setValue("article.content", html, { shouldValidate: true });
  };

  const onFormSubmit = (data) => {
    // Ensure content from editor is included in the submission
    const updatedData = {
      ...data,
      article: {
        ...data.article,
        content: stateToHTML(editorState.getCurrentContent()),
      },
    };
    onSubmit(updatedData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?.article?._id ? "Edit Article" : "Create Article"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
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
                disabled={!!initialData?.categoryId} // Disable if editing
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title}
                  </MenuItem>
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
                disabled={!!initialData?.subCategoryTitle} // Disable if editing
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

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Article Content
            </Typography>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "link",
                  "emoji",
                  "image",
                  "history",
                ],
                inline: { inDropdown: false },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: false },
              }}
            />
            {/* Hidden field to store content */}
            <Controller
              name="article.content"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData?.article?._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default function SupportManager() {
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Custom notification hook
  const { notification, showNotification, hideNotification } =
    useNotification();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/support/categories`
      );
      if (response.data.status === "success") {
        setCategories(response.data.data);
        showNotification("Categories loaded successfully");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification(
        error.response?.data?.message || "Failed to load categories",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category operations
  const handleCreateCategory = async (formData) => {
    try {
      const url = selectedCategory
        ? `${process.env.REACT_APP_API_URL}/support/category/${selectedCategory._id}`
        : `${process.env.REACT_APP_API_URL}/support/category`;

      const method = selectedCategory ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        await fetchCategories();
        setCategoryDialogOpen(false);
        setSelectedCategory(null);
        showNotification(
          selectedCategory
            ? "Category updated successfully"
            : "Category created successfully"
        );
      }
    } catch (error) {
      console.error("Error creating/updating category:", error);
      showNotification(
        error.response?.data?.message || "Failed to save category",
        "error"
      );
    }
  };

  // Handle article operations
  const handleCreateArticle = async (data) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/support/article`,
        data
      );
      await fetchCategories();
      setArticleDialogOpen(false);
      showNotification("Article created successfully");
    } catch (error) {
      console.error("Error creating article:", error);
      showNotification(
        error.response?.data?.message || "Failed to create article",
        "error"
      );
    }
  };

  // In your SupportManager component
  const handleUpdateArticle = async (data) => {
    try {
      if (!selectedArticle) {
        throw new Error("No article selected for update");
      }

      // Ensure all article data is included in the updates
      const updateData = {
        categoryId: data.categoryId,
        subCategoryId: selectedArticle.subCategoryId,
        articleSlug: selectedArticle.article.slug,
        updates: {
          _id: selectedArticle.article._id,
          title: data.article.title,
          slug:
            data.article.slug ||
            data.article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          content: data.article.content, // Make sure this is being passed from the form
        },
      };

      console.log("Update Data being sent:", updateData); // For debugging

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/support/articleupdate`,
        updateData
      );

      if (response.data.status === "success") {
        await fetchCategories();
        setArticleDialogOpen(false);
        setSelectedArticle(null);
        showNotification("Article updated successfully");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      showNotification(
        error.response?.data?.message || "Failed to update article",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete) return;

      if (itemToDelete.type === "category") {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/support/category/${itemToDelete.id}`
        );
        showNotification("Category deleted successfully");
      } else if (itemToDelete.type === "article") {
        const { categoryId, subCategoryId, article } = selectedItem.data;
        await axios.delete(`${process.env.REACT_APP_API_URL}/support/article`, {
          data: {
            categoryId,
            subCategoryId, // Use subcategory ID instead of title
            articleSlug: article.slug,
          },
        });
        showNotification("Article deleted successfully");
      }

      await fetchCategories();
    } catch (error) {
      console.error("Error deleting item:", error);
      showNotification(
        error.response?.data?.message || "Failed to delete item",
        "error"
      );
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      setSelectedItem(null);
    }
  };

  console.log("Selected item:", selectedItem);

  // Menu handlers
  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);

    if (item.type === "article") {
      const articleData = {
        categoryId: item.data.categoryId,
        subCategoryId: item.data.subCategoryId || item.data.article._id, // Ensure we have the ID
        subCategoryTitle: item.data.subCategoryTitle,
        article: {
          _id: item.data.article._id,
          title: item.data.article.title,
          slug: item.data.article.slug,
          content: item.data.article.content,
        },
      };

      setSelectedItem({
        type: "article",
        data: articleData,
        id: item.data.article._id,
      });
    } else {
      setSelectedItem(item);
    }
  };

  const handleMenuClose = () => {
    setActionMenuAnchor(null);
    // setSelectedItem(null);
  };

  // Handle menu actions
  const handleAction = (action) => {
    handleMenuClose();
    if (!selectedItem) return;

    switch (action) {
      case "edit":
        if (selectedItem.type === "category") {
          setSelectedCategory(selectedItem.data);
          setCategoryDialogOpen(true);
        } else if (selectedItem.type === "article") {
          // Ensure we pass the complete data structure
          setSelectedArticle({
            categoryId: selectedItem.data.categoryId,
            subCategoryId: selectedItem.data.subCategoryId,
            subCategoryTitle: selectedItem.data.subCategoryTitle,
            article: {
              _id: selectedItem.data.article._id,
              title: selectedItem.data.article.title,
              slug: selectedItem.data.article.slug,
              content: selectedItem.data.article.content,
            },
          });
          setArticleDialogOpen(true);
        }
        break;
      case "delete":
        setItemToDelete({
          id: selectedItem.id,
          type: selectedItem.type,
          data: selectedItem.data,
        });
        setDeleteConfirmOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <Box p={3}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Support Categories & Articles</Typography>
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Card>
        {loading && <LinearProgress />}
        <Box p={2}>
          {categories?.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={4}
            >
              <Typography color="textSecondary" gutterBottom>
                No categories found
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchCategories}
              >
                Refresh
              </Button>
            </Box>
          ) : (
            categories?.map((category) => (
              <Accordion
                key={category._id}
                expanded={expandedCategory === category._id}
                onChange={() =>
                  setExpandedCategory(
                    expandedCategory === category._id ? null : category._id
                  )
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    sx={{ py: 1 }}
                  >
                    <CategoryIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {category.title}
                    </Typography>
                    <Tooltip title="Category actions">
                      <IconButton
                        size="small"
                        onClick={(e) =>
                          handleMenuOpen(e, {
                            type: "category",
                            data: category,
                          })
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {category.subCategories?.map((subCategory) => (
                    <Box key={subCategory._id} mb={3}>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <ChevronRightIcon sx={{ mr: 1 }} />
                        {subCategory.title}
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          {subCategory.articles?.map((article) => (
                            <TableRow
                              key={article._id}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "action.hover",
                                },
                              }}
                            >
                              {console.log(article, "article")}

                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <ArticleIcon
                                    sx={{
                                      mr: 1,
                                      color: "secondary.main",
                                      fontSize: 20,
                                    }}
                                  />
                                  {article.title}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Article actions">
                                  <IconButton
                                    size="small"
                                    onClick={(e) =>
                                      handleMenuOpen(e, {
                                        type: "article",
                                        data: {
                                          categoryId: category._id,
                                          subCategoryId: subCategory._id, // Add subcategory ID
                                          subCategoryTitle: subCategory.title,
                                          article: article,
                                        },
                                      })
                                    }
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      </Card>
      {console.log("selectedArticle", selectedArticle)}
      {/* Dialogs */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {itemToDelete?.type}? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction("edit")}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleAction("delete")}
          sx={{ color: "error.main" }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Dialog
        open={loading}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <CircularProgress />
      </Dialog>

      {/* Styles */}
      <style jsx>{`
        .demo-editor {
          min-height: 300px;
          border: 1px solid #f1f1f1;
          padding: 5px;
          border-radius: 4px;
        }

        .demo-toolbar {
          border: 1px solid #f1f1f1;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .article-preview {
          margin-top: 16px;
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #fafafa;
        }

        .category-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
          margin-right: 16px;
        }

        .subcategory-section {
          margin-left: 24px;
          border-left: 2px solid #e0e0e0;
          padding-left: 16px;
        }

        .article-item {
          transition: background-color 0.2s;
        }

        .article-item:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        .action-button {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .article-item:hover .action-button {
          opacity: 1;
        }
      `}</style>
    </Box>
  );
}

// Utility functions for content management
const processContent = (content) => {
  // Remove unnecessary whitespace
  content = content.trim();

  // Convert line breaks to proper HTML
  content = content.replace(/(?:\r\n|\r|\n)/g, "<br>");

  // Add default styles for better presentation
  const defaultStyles = {
    p: "margin-bottom: 1em;",
    h1: "font-size: 2em; margin-bottom: 0.5em;",
    h2: "font-size: 1.5em; margin-bottom: 0.5em;",
    h3: "font-size: 1.17em; margin-bottom: 0.5em;",
    ul: "margin-left: 20px; margin-bottom: 1em;",
    ol: "margin-left: 20px; margin-bottom: 1em;",
    li: "margin-bottom: 0.5em;",
    a: "color: #1976d2; text-decoration: none;",
    "a:hover": "text-decoration: underline;",
  };

  // Add default styles to HTML string
  Object.entries(defaultStyles).forEach(([tag, style]) => {
    const regex = new RegExp(`<${tag}`, "g");
    content = content.replace(regex, `<${tag} style="${style}"`);
  });

  return content;
};

const validateContent = (content) => {
  // Check for common HTML security issues
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
  ];

  const hasSuspiciousContent = suspiciousPatterns.some((pattern) =>
    pattern.test(content)
  );

  if (hasSuspiciousContent) {
    throw new Error("Potentially unsafe HTML content detected");
  }

  return true;
};

const sanitizeSlug = (slug) => {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Custom hook for managing article content
const useArticleContent = (initialContent = "") => {
  const [content, setContent] = useState(initialContent);
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const blocksFromHTML = convertFromHTML(initialContent);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const updateContent = (newEditorState) => {
    setEditorState(newEditorState);
    const html = stateToHTML(newEditorState.getCurrentContent());
    setContent(processContent(html));
  };

  return {
    content,
    editorState,
    updateContent,
  };
};

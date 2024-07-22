// import { Edit } from "@mui/icons-material";
import { Done } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Grid,
  Modal,
  TextField,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Pagination,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Fragment } from "react";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Paragraph } from "app/components/Typography";
import blogServices from "services/blogServices.tsx";
import useAuth from "app/hooks/useAuth";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Swal from "sweetalert2";
import Slide from "@mui/material/Slide";
import Preview from "./Preview";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import DOMPurify from "dompurify";
import htmlToDraft from "html-to-draftjs";
// STYLED COMPONENTS

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImagePreview = styled("img")({
  width: "100%",
  maxWidth: "200px",
  marginTop: "10px",
});

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BlogList() {
  const { login, user } = useAuth();
  console.log("🚀 ~ TopSellingTable ~ user:", user);
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(null);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [editOpen, setEditOpen] = useState(false);

  console.log("selectedBlog", selectedBlog);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleClose = () => {
    setSelectedBlog({});
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await blogServices.getBlogList(page, limit, search);
      console.log("response", response);
      if (response.status === "success") {
        setData(response.data);
        // setTotalPages(response.data.totalPages);
      }
    };
    fetchData();
  }, [page, limit, search, refresh]);

  console.log("user?.role", user?.role === "superadmin");
  console.log("data", data);

  //   [
  //     {
  //       _id: '6680fa04c4f106a4d7f4bd49',
  //       user: { _id: '667a7c4e74b4e88bf508f369', name: 'Super Admin' },
  //       url: 'http://localhost:3000/blog/werew',
  //       title: 'rwew',
  //       slug: 'werew',
  //       date: '2024-06-30T06:24:00.201Z',
  //       category: { title: 'wer', slug: 'werew' },
  //       description: 'wrwer',
  //       thumbnail:
  //         'https://res.cloudinary.com/dh187xay8/image/upload/v1719728574/thumbnail/file.png',
  //       content: '<p>werewrewrw</p>',
  //       createdAt: '2024-06-30T06:24:04.394Z',
  //       source: 'kryptomerch'
  //     },

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  console.log(editorState);

  const htmlContent = editorState
    ? stateToHTML(editorState.getCurrentContent())
    : "";
  console.log(htmlContent);

  const handleSubmit = () => {
    if (title === "" || !editorState) {
      // alert("Please fill in the title and content");
      setError(true);
      setErrorText("Please fill in the title and content");
      setSuccess(false);
      setTimeout(() => {
        setError(false);
        setErrorText("");
      }, 3000);

      return;
    }
    if (image === null) {
      // alert("Please upload an image");
      setError(true);
      setErrorText("Please upload an image");
      setSuccess(false);
      setTimeout(() => {
        setError(false);
        setErrorText("");
      }, 3000);

      return;
    }

    if (description === "") {
      // alert("Please fill in the description");
      setError(true);
      setErrorText("Please fill in the description");
      setSuccess(false);
      setTimeout(() => {
        setError(false);
        setErrorText("");
      }, 3000);

      return;
    }

    if (slug === "") {
      // alert("Please fill in the slug");
      setError(true);
      setErrorText("Please fill in the slug");
      setSuccess(false);
      setTimeout(() => {
        setError(false);
        setErrorText("");
      }, 3000);

      return;
    }

    if (category === "") {
      // alert("Please fill in the category");
      setError(true);
      setErrorText("Please fill in the category");
      setSuccess(false);
      setTimeout(() => {
        setError(false);
        setErrorText("");
      }, 3000);

      return;
    }

    // const blogPost = {
    //   title,
    //   description,
    //   content: stateToHTML(editorState.getCurrentContent()),
    // };

    //forma data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", htmlContent);
    formData.append("thumbnail", image);
    formData.append("slug", slug);
    formData.append("category", category);

    blogServices
      .editBlog(formData, selectedBlog._id)
      .then((res) => {
        console.log(res, "res");
        // Handle success (e.g., show a success message, redirect)
        setError(false);
        setSuccess(true);
        setSuccessText("Blog edited successfully");
        setRefresh(!refresh);
        setEditOpen(false);
        setTimeout(() => {
          setSuccess(false);
          setSuccessText("");
        }, 3000);

        Swal.fire("Success", "Blog edited successfully", "success");
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorText(err.response.data.message);
        setSuccess(false);
        setTimeout(() => {
          setError(false);
          setErrorText("");
        }, 3000);
        setEditOpen(false);
        Swal.fire("Error", err.response.data.message, "error");

        // Handle error (e.g., show an error message)
      });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle blog selection
  const handleBlogSelection = (blog) => {
    setSelectedBlog(blog);
    setEditOpen(true);
  };

  useEffect(() => {
    if (selectedBlog) {
      setTitle(selectedBlog.title || "");
      setDescription(selectedBlog.description || "");
      setSlug(selectedBlog.slug || "");
      setCategory(selectedBlog.category?.title || "");
      setImagePreview(selectedBlog.thumbnail || "");
      setImage(selectedBlog.thumbnail || "");

      if (selectedBlog.content && typeof selectedBlog.content === "string") {
        try {
          // Sanitize the HTML
          const sanitizedHtml = DOMPurify.sanitize(selectedBlog.content);

          // Convert HTML to ContentBlocks
          const blocksFromHTML = convertFromHTML(sanitizedHtml);

          // Create ContentState from blocks
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );

          // Create EditorState from ContentState
          const editorState = EditorState.createWithContent(contentState);

          setEditorState(editorState);
        } catch (error) {
          console.error("Error setting up editor state:", error);
          setEditorState(EditorState.createEmpty());
        }
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [selectedBlog]);

  return (
    <>
      <Fragment>
        <ContentBox className="analytics">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
                <CardHeader>
                  <Title>Blog List</Title>
                  <Box display="flex" justifyContent="flex-start" px={2}>
                    <TextField
                      size="small"
                      label="Search"
                      variant="outlined"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Box>
                  <Select size="small" defaultValue="paid" variant="outlined">
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </CardHeader>

                <Box overflow="auto">
                  <ProductTable>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          Title
                        </TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Likes</TableCell>
                        <TableCell>View</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data?.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell colSpan={2} sx={{ px: 0 }}>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={item.thumbnail}
                                sx={{ width: 40, height: 40, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {item.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {item.description}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {item.category.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {item.source}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {moment(item.date).format("DD MMM YYYY")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">0</Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {/* <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleClickOpen();
                                        }
                                    }
                                >
                                    View
                                </Button> */}
                              <IconButton
                                onClick={() => {
                                  setSelectedBlog(item);
                                  handleClickOpen();
                                }}
                              >
                                <Visibility color="primary" />
                              </IconButton>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBlogSelection(item)}
                              >
                                Edit
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, delete it!",
                                    cancelButtonText: "No, cancel!",
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      const response =
                                        await blogServices.deleteBlog(item._id);
                                      if (response.status === "success") {
                                        Swal.fire(
                                          "Deleted!",
                                          "Your file has been deleted.",
                                          "success"
                                        );
                                        setRefresh(!refresh);
                                      }
                                    } else if (
                                      result.dismiss ===
                                      Swal.DismissReason.cancel
                                    ) {
                                      Swal.fire(
                                        "Cancelled",
                                        "Your file is safe :)",
                                        "error"
                                      );
                                    }
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </ProductTable>
                </Box>

                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Dialog
            fullScreen
            open={editOpen}
            onClose={handleEditClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: "relative", backgroundColor: "white" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleEditClose}
                  aria-label="close"
                >
                  <CloseIcon sx={{ color: "black" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    color: "black",
                    fontWeight: 700,
                    fontSize: 20,
                    textAlign: "center",
                    marginLeft: "20px",
                  }}
                >
                  Edit Blog
                </Typography>
              </Toolbar>
            </AppBar>

            {/* //success and eror notification bar */}
            {success && (
              <Card
                sx={{
                  backgroundColor: "#00aa00",
                  padding: 2,
                  marginBottom: 2,
                  color: "white",
                }}
              >
                {successText}
              </Card>
            )}

            {error && (
              <Card
                sx={{
                  backgroundColor: "#aa2700",
                  padding: 2,
                  marginBottom: 2,
                  color: "white",
                }}
              >
                {errorText}
              </Card>
            )}

            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              error={error && title === ""}
            />

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              error={error && description === ""}
            />

            <TextField
              fullWidth
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              margin="normal"
              error={error && slug === ""}
            />

            <TextField
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              error={error && category === ""}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <ImagePreview src={imagePreview} alt="Preview" />
                </Box>
              )}
            </Box>

            <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              editorStyle={{
                minHeight: "300px",
                border: "1px solid #f1f1f1",
                padding: "10px",
                background: `${color}`,
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}> </Box>

            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
                mb: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2, mr: 2 }}
              >
                Edit Blog
              </Button>
            </Grid>
          </Dialog>
          <Preview
            open={open}
            handleClose={handleClose}
            selectedBlog={selectedBlog}
            blodTitle={"View Blog"}
          />
        </ContentBox>
      </Fragment>
    </>
  );
}

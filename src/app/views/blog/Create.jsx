import React,{useState,useEffect} from 'react';
import { Card, Grid, Box, styled, useTheme, Button } from "@mui/material";
import { Span } from "app/components/Typography";
import Breadcrumb from "app/components/Breadcrumb";
import TextField from "@mui/material/TextField";
import { Editor } from "react-draft-wysiwyg";
import { SketchPicker } from "react-color";
import { stateToHTML } from "draft-js-export-html";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import blogServices from "services/blogServices.tsx";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Preview from './Preview';

import "./config.css";
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": {
    marginBottom: 30,
    [theme.breakpoints.down("sm")]: { marginBottom: 16 },
  },
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


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(null);
  const [publicationDate, setPublicationDate] = useState(new Date());
  const [featuredImage, setFeaturedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [scroller, setScroller] = useState(false);
  const [htmlFromApi, setHtmlFromApi] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [open, setOpen] = React.useState(false);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(image, "image");

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
      .createBlog(formData)
      .then((res) => {
        console.log(res, "res");
        // Handle success (e.g., show a success message, redirect)
        setError(false);
        setSuccess(true);
        setSuccessText("Blog created successfully");
        setTimeout(() => {
          setSuccess(false);
          setSuccessText("");
        }, 3000);
        setTitle("");
        setDescription("");
        setEditorState(null);
        setImage(null);
        setSlug("");
        setCategory("");
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorText(err.response.data.message);
        setTimeout(() => {
          setError(false);
          setErrorText("");
        }, 3000);

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

  return (
    <>
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: "Blog", path: "/blog" },
              { name: "Create Blog" },
            ]}
          />
        </Box>

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

        <Grid
          container
          spacing={2}
          sx={{ mt: 2, mb: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2, mr: 2 }}
          >
            Create Blog
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ mt: 2 }}
          >
            Preview
          </Button>
        </Grid>

        {/* <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            
          </Toolbar>
        </AppBar>
      </Dialog> */}

      <Preview
        open={open}
        handleClose={handleClose}
        blodTitle={"Blog Preview"}
        selectedBlog={{
          title,
          date: publicationDate,
          content: htmlContent,
          category:{
            title:category
          },
          thumbnail: imagePreview,
          description,
          source: "admin",
        }}
      />


      </Container>
    </>
  );
};
export default CreateBlog;

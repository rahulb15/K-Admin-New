// import { Edit } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, styled, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import useAuth from "app/hooks/useAuth";
import moment from "moment";
import React, { Fragment } from "react";

// STYLED COMPONENTS

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Preview(props) {
  console.log(props?.selectedBlog);
  const { login, user } = useAuth();
  const { palette } = useTheme();

  return (
    <>
      <Fragment>
        <ContentBox className="analytics">
          <Dialog
            fullScreen
            open={props?.open}
            onClose={props?.handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: "relative", backgroundColor: "white" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={props?.handleClose}
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
                  {props?.blodTitle}
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Blog page content */}
            <Box
              sx={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "40px 20px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {props?.selectedBlog?.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 2 }}
                >
                  {moment(props?.selectedBlog?.date).format("MMMM D, YYYY")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 2 }}
                >
                  •
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {props?.selectedBlog?.category?.title}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <img
                  src={props?.selectedBlog?.thumbnail}
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "#555",
                }}
              >
                {props?.selectedBlog?.description}
              </Typography>

              <Box
                sx={{
                  textAlign: "justify",
                  "& p": {
                    marginBottom: "1rem",
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                  },
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: props?.selectedBlog?.content,
                  }}
                />
              </Box>

              <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid #eaeaea" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Posted by: {props?.selectedBlog?.user?.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Source: {props?.selectedBlog?.source}
                </Typography>
              </Box>
            </Box>
          </Dialog>
        </ContentBox>
      </Fragment>
    </>
  );
}

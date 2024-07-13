import React, { useState } from "react";
import { Card, Grid, Box, styled, useTheme, Button } from "@mui/material";
import { Span } from "app/components/Typography";
import Breadcrumb from "app/components/Breadcrumb";
import TextField from "@mui/material/TextField";
import { Editor } from "react-draft-wysiwyg";
import { useEffect } from "react";
import { SketchPicker } from "react-color";
import { stateToHTML } from "draft-js-export-html";
import Switch from "@mui/material/Switch";
import userServices from "services/userServices.tsx";

import "./config.css";
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

const TickerController = () => {
  const [editorState, setEditorState] = useState(null);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [color, setColor] = useState("#fff");
  const [scroller, setScroller] = useState(false);
  const [htmlFromApi, setHtmlFromApi] = useState("");

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  console.log(editorState);

  const htmlContent = editorState ? stateToHTML(editorState.getCurrentContent()) : "";

  const handleSubmit = () => {
    //html as parse string and scroll as boolean color as string
    // console.log(JSON.stringify({ html: htmlContent}));
    // setJson({ html: htmlContent });

    if (htmlContent === "") {
      alert("Please fill the content");
      return;
    }

    const value = {
      html: htmlContent,
      color: color,
      scroller: scroller
    };
    const key = "ticker";
    userServices
      .createConfig(key, value)
      .then((res) => {
        console.log(res, "res");
        // {
        //   status: 'success',
        //   message: 'Updated',
        //   description: 'The request has succeeded and the resource has been updated.',
        //   data: {
        //     _id: '6602ad9582f31fa21b67caa8',
        //     key: 'ticker',
        //     value: { html: '<p>fdgfd</p>', color: '#fff', scroller: false },
        //     group: 'system',
        //     public: false,
        //     type: 'text',
        //     createdAt: '2024-03-26T11:12:21.074Z',
        //     updatedAt: '2024-03-26T11:12:21.074Z'
        //   }
        // }
        if (res.status === "success") {
          setHtmlFromApi(res.data.value.html);
          setColor(res.data.value.color);
          setScroller(res.data.value.scroller);
        } else {
          alert("Failed to save data");
          setHtmlFromApi("");
          setColor("#fff");
          setScroller(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    userServices
      .getConfig("ticker")
      .then((res) => {
        console.log(res, "res");
        if (res.status === "success") {
          if (res.data.key === "ticker") {
            setHtmlFromApi(res.data.value.html);
            setColor(res.data.value.color);
            setScroller(res.data.value.scroller);
          } else {
            setHtmlFromApi("");
            setColor("#fff");
            setScroller(false);
          }
        } else {
          alert("Failed to get data");
          setHtmlFromApi("");
          setColor("#fff");
          setScroller(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[{ name: "Config", path: "/config" }, { name: "Ticker Controller" }]}
          />
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
            background: `${color}`
          }}
        />

        {/* button click to open color picker */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenColorPicker(!openColorPicker)}
        >
          Open Color Picker
        </Button>

        {openColorPicker && (
          <Box mt={2}>
            <SketchPicker
              color={color}
              onChange={(color) => {
                const newColor = color.hex;
                setColor(newColor);
              }}
            />
          </Box>
        )}

        {/* editor content */}
        <Card elevation={3} className="p-30 mt-30">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} className="mb-30">
              <Span fontWeight="bold">Editor Content</Span>
              {/* <TextField
              fullWidth
              multiline
              rows={10}
              sx={{
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-word",
                hyphens: "auto",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                background: `${color}`
              }}
              value={htmlContent}
            /> */}
              {/* <div
                dangerouslySetInnerHTML={{ __html: htmlFromApi }}
                style={{
                  whiteSpace: "pre-line",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  background: `${color}`
                }}
              /> */}
              <section className="ticker-wrap" style={{ backgroundColor: `${color}` }}>
                <div className={` ${scroller ? "ticker" : ""}`}>
                  <div
                    className="ticker__content"
                    dangerouslySetInnerHTML={{ __html: htmlFromApi }}
                  ></div>
                </div>
              </section>
            </Grid>
            <Grid item xs={12} md={6}>
              <Span fontWeight="bold">Color</Span>
              <TextField fullWidth value={color} />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mt-30">
            <Grid item xs={12} md={6}>
              <Span fontWeight="bold">Ticker Scroller</Span>
              <Switch
                checked={scroller}
                onChange={(event) => setScroller(event.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mt-30">
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};
export default TickerController;

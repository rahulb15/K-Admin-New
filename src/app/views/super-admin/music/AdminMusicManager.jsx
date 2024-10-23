import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  TextField,
  Button,
  Pagination,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { PlayArrow, Pause, Delete, CloudUpload } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import musicServices from "services/musicServices.tsx";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const CardHeader = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
}));

const FilterBox = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "20px",
});

const LoaderWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
});

const uploadSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  music: yup
    .mixed()
    .test(
      "required",
      "Music file is required",
      (value) => value && value.length > 0
    )
    .test("fileSize", "File size is too large (max 50MB)", (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 50 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value || !value[0]) return true;
      return ["audio/mpeg", "audio/wav", "audio/ogg", "audio/aac"].includes(
        value[0].type
      );
    }),
  cover: yup
    .mixed()
    .test("fileSize", "Cover image is too large (max 5MB)", (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported image type", (value) => {
      if (!value || !value[0]) return true;
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        value[0].type
      );
    }),
});

// function MusicUploadDialog({ open, handleClose, onUploadSuccess }) {
//   const { control, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: yupResolver(uploadSchema),
//   });
//   const [uploading, setUploading] = useState(false);

//   const onSubmit = async (data) => {
//     try {
//       setUploading(true);
//       const formData = new FormData();
//       formData.append("title", data.title);
//       formData.append("music", data.music[0]);

//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/v1/music/upload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Music uploaded successfully",
//         });
//         reset();
//         onUploadSuccess();
//         handleClose();
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.message || "Failed to upload music",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Upload Music</DialogTitle>
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
//             name="music"
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, value, ...field } }) => (
//               <TextField
//                 {...field}
//                 type="file"
//                 fullWidth
//                 margin="normal"
//                 inputProps={{
//                   accept: "audio/*",
//                 }}
//                 onChange={(e) => onChange(e.target.files)}
//                 error={!!errors.music}
//                 helperText={errors.music?.message}
//               />
//             )}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={uploading}
//           >
//             {uploading ? <CircularProgress size={24} /> : "Upload"}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

function MusicUploadDialog({ open, handleClose, onUploadSuccess }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(uploadSchema),
  });
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverFile = watch("cover");

  useEffect(() => {
    if (coverFile && coverFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(coverFile[0]);
    } else {
      setCoverPreview(null);
    }
  }, [coverFile]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("music", data.music[0]);
      if (data.cover && data.cover[0]) {
        formData.append("cover", data.cover[0]);
      }
      const response = await musicServices.uploadMusic(formData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Music uploaded successfully",
        });
        reset();
        setCoverPreview(null);
        onUploadSuccess();
        handleClose();
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to upload music",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Music</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
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
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="music"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    type="file"
                    fullWidth
                    margin="normal"
                    inputProps={{
                      accept: "audio/*",
                    }}
                    onChange={(e) => onChange(e.target.files)}
                    error={!!errors.music}
                    helperText={errors.music?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="cover"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ...field } }) => (
                  <Box>
                    <TextField
                      {...field}
                      type="file"
                      fullWidth
                      margin="normal"
                      inputProps={{
                        accept: "image/*",
                      }}
                      onChange={(e) => onChange(e.target.files)}
                      error={!!errors.cover}
                      helperText={
                        errors.cover?.message ||
                        "Optional: Upload cover image (max 5MB)"
                      }
                    />
                    {coverPreview && (
                      <Box mt={2} textAlign="center">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function AdminMusicManager() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [limit] = useState(10);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audio] = useState(new Audio());

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await musicServices.getMusicList(page, limit, search);
      if (response.status === "success") {
        setTracks(response.data.data);
        setTotalPages(Math.ceil(response.data.total / limit));
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load music tracks",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("tracks", tracks);

  useEffect(() => {
    fetchTracks();
  }, [page, search]);

  const handleDelete = async (trackId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await musicServices.deleteMusic(trackId);
        Swal.fire("Deleted!", "Music track has been deleted.", "success");
        fetchTracks();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete track",
        });
      }
    }
  };

  const handlePlayPause = (track) => {
    if (playingTrack && playingTrack._id === track._id) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      if (playingTrack) {
        audio.pause();
      }
      audio.src = track.ipfsUrl;
      audio.play();
      setPlayingTrack(track);
    }
  };

  useEffect(() => {
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader>
              <h2>Music Manager</h2>
              <FilterBox>
                <TextField
                  label="Search Music"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUpload />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Upload Music
                </Button>
              </FilterBox>
            </CardHeader>

            {loading ? (
              <LoaderWrapper>
                <CircularProgress />
              </LoaderWrapper>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cover</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tracks.map((track) => (
                      <TableRow key={track._id}>
                        <TableCell>
                          <Box
                            component="img"
                            src={
                              track.coverImage?.ipfsUrl || "/default-cover.png"
                            }
                            alt={track.title}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </TableCell>
                        <TableCell>{track.title}</TableCell>
                        <TableCell>
                          {new Date(track.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {Math.round(track.size / 1024 / 1024)}MB
                        </TableCell>
                        <TableCell>{track.mimeType}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handlePlayPause(track)}
                          >
                            {playingTrack &&
                            playingTrack._id === track._id &&
                            !audio.paused ? (
                              <Pause />
                            ) : (
                              <PlayArrow />
                            )}
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(track._id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      <MusicUploadDialog
        open={uploadDialogOpen}
        handleClose={() => setUploadDialogOpen(false)}
        onUploadSuccess={fetchTracks}
      />
    </ContentBox>
  );
}

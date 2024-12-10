import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  CircularProgress,
  Avatar,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete, Person, CloudUpload } from '@mui/icons-material';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import connectService from 'services/connect.service.ts';

const artistSchema = yup.object().shape({
  name: yup.string().required('Artist name is required'),
  title: yup.string().required('Title is required'),
  description: yup.string(),
  image: yup
    .mixed()
    .test('fileSize', 'File too large', (value) => {
      if (!value?.[0]) return true;
      return value[0].size <= 2000000; // 2MB limit
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value?.[0]) return true;
      return value[0].type.startsWith('image/');
    })
});

const ArtistDialog = ({ open, onClose, onSubmit, initialData }) => {
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(artistSchema),
    defaultValues: initialData || {
      name: '',
      title: '',
      description: '',
      image: null
    }
  });

  const [previewUrl, setPreviewUrl] = useState(initialData?.image || null);
  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile?.[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    reset(initialData || {
      name: '',
      title: '',
      description: '',
      image: null
    });
    setPreviewUrl(initialData?.image || null);
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Artist' : 'Add Artist'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box mb={3} display="flex" justifyContent="center">
            <Avatar
              src={previewUrl}
              sx={{ width: 120, height: 120 }}
              alt="Artist preview"
            >
              <Person sx={{ width: 60, height: 60 }} />
            </Avatar>
          </Box>

          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Box mb={2}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                  />
                </Button>
                {errors.image && (
                  <Typography color="error" variant="caption" display="block" mt={1}>
                    {errors.image.message}
                  </Typography>
                )}
              </Box>
            )}
          />
          
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Artist Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          
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
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PreviewCard = ({ data }) => (
  <Card sx={{ mt: 3 }}>
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      <Divider />
      <Box mt={2} display="flex">
        <Box flex={1}>
          {data?.logo && (
            <Box mb={2}>
              <img 
                src={data.logo} 
                alt="Logo" 
                style={{ maxWidth: 200, height: 'auto' }} 
              />
            </Box>
          )}
          {data?.backgroundImage && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Background Image
              </Typography>
              <img 
                src={data.backgroundImage} 
                alt="Background" 
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            </Box>
          )}
        </Box>
        <Box flex={1}>
          {data?.activeArtist && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Active Artist
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={data.artists?.find(a => a._id === data.activeArtist)?.image}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {data.artists?.find(a => a._id === data.activeArtist)?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.artists?.find(a => a._id === data.activeArtist)?.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  </Card>
);

export default function ConnectManager() {
  const [loading, setLoading] = useState(false);
  const [connectPage, setConnectPage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchConnectPage = async () => {
    setLoading(true);
    try {
      const response = await connectService.getConnectPage();
      if (response.status === 'success') {
        setConnectPage(response.data);
      } else {
        showSnackbar(response.message || 'Error fetching connect page data', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching connect page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectPage();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdatePage = async (files) => {
    try {
      const formData = new FormData();
      if (files.logo) {
        formData.append('logo', files.logo[0]);
      }
      if (files.backgroundImage) {
        formData.append('backgroundImage', files.backgroundImage[0]);
      }

      const response = await connectService.updateConnectPage(formData);
      
      if (response.status === 'success') {
        showSnackbar('Page assets updated successfully');
        await fetchConnectPage();
      } else {
        showSnackbar(response.message || 'Error updating page assets', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating page assets', 'error');
    }
  };

  const handleAddArtist = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }

      let response;
      if (selectedArtist) {
        response = await connectService.updateArtist(selectedArtist._id, formData);
      } else {
        response = await connectService.addArtist(formData);
      }

      if (response.status === 'success') {
        showSnackbar(`Artist ${selectedArtist ? 'updated' : 'added'} successfully`);
        setDialogOpen(false);
        await fetchConnectPage();
      } else {
        showSnackbar(response.message || `Error ${selectedArtist ? 'updating' : 'adding'} artist`, 'error');
      }
    } catch (error) {
      showSnackbar('Error saving artist', 'error');
    }
  };

  const handleSetActiveArtist = async (artistId) => {
    try {
      const response = await connectService.setActiveArtist(artistId);
      
      if (response.status === 'success') {
        showSnackbar('Active artist updated');
        await fetchConnectPage();
      } else {
        showSnackbar(response.message || 'Error updating active artist', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating active artist', 'error');
    }
  };

  const handleDeleteArtist = async (artistId) => {
    try {
      const response = await connectService.deleteArtist(artistId);
      
      if (response.status === 'success') {
        showSnackbar('Artist deleted successfully');
        await fetchConnectPage();
      } else {
        showSnackbar(response.message || 'Error deleting artist', 'error');
      }
    } catch (error) {
      showSnackbar('Error deleting artist', 'error');
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box p={2}>
              <Typography variant="h5" gutterBottom>
                Connect Page Management
              </Typography>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Page Assets
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="file"
                      fullWidth
                      label="Logo"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => handleUpdatePage({ logo: e.target.files })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="file"
                      fullWidth
                      label="Background Image"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => handleUpdatePage({ backgroundImage: e.target.files })}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Artists
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => {
                      setSelectedArtist(null);
                      setDialogOpen(true);
                    }}
                  >
                    Add Artist
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {connectPage?.artists?.map((artist) => (
                    <Grid item xs={12} sm={6} md={4} key={artist._id}>
                      <Card>
                        <Box p={2}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar src={artist.image} sx={{ width: 50, height: 50, mr: 2 }}>
                              <Person />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="h6">
                                {artist.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {artist.title}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {artist.description && (
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {artist.description}
                            </Typography>
                          )}
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2" mr={1}>Active</Typography>
                              <Switch
                                checked={artist._id === connectPage?.activeArtist}
                                onChange={() => handleSetActiveArtist(artist._id)}
                                color="primary"
                              />
                            </Box>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedArtist(artist);
                                  setDialogOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteArtist(artist._id)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <PreviewCard data={connectPage} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <ArtistDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedArtist(null);
        }}
        onSubmit={handleAddArtist}
        initialData={selectedArtist}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.7)"
          zIndex={9999}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
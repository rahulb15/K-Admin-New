import { Fragment } from "react";
import { Box, Fab, Card, Grid, styled, Avatar, Checkbox, IconButton } from "@mui/material";
import { MoreVert, StarOutline } from "@mui/icons-material";
import { Span } from "app/components/Typography";

// STYLED COMPONENTS
const ProjectName = styled(Span)(({ theme }) => ({
  marginLeft: 24,
  fontWeight: "500",
  [theme.breakpoints.down("sm")]: { marginLeft: 4 }
}));

const StyledFabStar = styled(Fab)(({ theme }) => ({
  marginLeft: 0,
  boxShadow: "none",
  background: "#08ad6c !important",
  backgroundColor: "rgba(9, 182, 109, 1) !important",
  [theme.breakpoints.down("sm")]: { display: "none" }
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  marginLeft: 0,
  boxShadow: "none",
  color: "white !important",
  background: `${theme.palette.error.main} !important`,
  [theme.breakpoints.down("sm")]: { display: "none" }
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: "32px !important",
  height: "32px !important"
}));

export default function RowCards(props) {
  //nft project list Data
  const projectList = [
    {
      id: 1,
      title: "DB Cooper",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 2,
      title: "Priority Pass",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 3,
      title: "Others",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    }
  ];

  return projectList.map((project) => (
    <Fragment key={project.id}>
      <Card sx={{ py: 1, px: 2 }} className="project-card">
        <Grid container alignItems="center">
          <Grid item md={5} xs={7}>
            <Box display="flex" alignItems="center">
              <Checkbox />

              {project.id % 2 === 1 ? (
                <StyledFabStar size="small">
                  <StarOutline />
                </StyledFabStar>
              ) : (
                <StyledFab size="small">+</StyledFab>
              )}

              <ProjectName>{project.title}</ProjectName>
            </Box>
          </Grid>

          <Grid item xs={3} sx={{ display: { xs: "none", sm: "block" } }}>
            <Box display="flex" position="relative" marginLeft="-0.875rem !important">
              <StyledAvatar src="/assets/images/face-4.jpg" />
              <StyledAvatar src="/assets/images/face-4.jpg" />
              <StyledAvatar src="/assets/images/face-4.jpg" />
              <StyledAvatar sx={{ fontSize: "14px" }}>+3</StyledAvatar>
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Box py={1} />
    </Fragment>
  ));
}

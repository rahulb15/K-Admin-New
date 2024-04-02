import { Button, Card, styled } from "@mui/material";
import { convertHexToRGB } from "app/utils/utils";

// STYLED COMPONENTS
const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  padding: "24px !important",
  [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  position: "relative",
  padding: "24px !important",
  background: `rgb(${convertHexToRGB(theme.palette.primary.main)}, 0.15) !important`,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const Paragraph = styled("p")(({ theme }) => ({
  margin: 0,
  paddingTop: "24px",
  paddingBottom: "24px",
  color: theme.palette.text.secondary
}));

export default function NotificationListCard() {
  //nft notifaication Data
  const notificationData = [
    {
      id: 1,
      title: "New NFT Minted",
      description: "Your NFT has been minted successfully",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 2,
      title: "NFT Sold",
      description: "Your NFT has been sold successfully",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 3,
      title: "NFT Minting Failed",
      description: "Your NFT minting has been failed",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 4,
      title: "NFT Minting Failed",
      description: "Your NFT minting has been failed",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    },
    {
      id: 5,
      title: "NFT Minting Failed",
      description: "Your NFT minting has been failed",
      date: "2 hours ago",
      icon: "fas fa-coins",
      color: "primary"
    }
  ];

  return (
    <CardRoot>
      <StyledCard>
        <Paragraph>
          <strong>Notification List</strong>
        </Paragraph>
        {notificationData
          .filter((_, i) => i < 3)
          .map((notification) => (
            <Paragraph key={notification.id}>
              <i className={`${notification.icon} text-${notification.color}`} />
              <strong>{notification.title}</strong>
              <br />
              {notification.description}
              <br />
              <small>{notification.date}</small>
            </Paragraph>
          ))}
        <Button variant="contained" color="primary">
          View All
        </Button>
      </StyledCard>
    </CardRoot>
  );
}

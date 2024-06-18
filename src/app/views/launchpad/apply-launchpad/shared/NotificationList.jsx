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

export default function NotificationListCard(props) {
  console.log("props", props?.transactionData);
  //   {
  //   _id: '666ef4a55479a7aad1fa65c7',
  //   user: '6668a6337a3e7445d7096993',
  //   paymentId: 'cs_test_a191AtpYafmi0m7ULgFj0oHyLvr2GpNZATjmjJpOTWgcmyemLXHcoJEujN',
  //   paymentStatus: 'unpaid',
  //   paymentAmount: 100,
  //   paymentCurrency: 'usd',
  //   paymentDate: '2024-06-16T14:20:21.000Z',
  //   paymentMethod: 'card',
  //   paymentUserRole: 'user',
  //   order_id: '666eeb2c6622aa6e49d0c91f',
  //   isRefunded: false,
  //   createdAt: '2024-06-16T14:20:21.300Z',
  //   updatedAt: '2024-06-16T14:20:21.300Z'
  // }

  return (
    <CardRoot>
      <StyledCard>
        <Paragraph>
          <strong>Payment Detail</strong>
        </Paragraph>
        <Paragraph>
          <strong>Payment ID:</strong> {props?.transactionData?.paymentId}
        </Paragraph>
        <Paragraph>
          <strong>Payment Status:</strong> {props?.transactionData?.paymentStatus}
        </Paragraph>
        <Paragraph>
          <strong>Payment Amount:</strong> {props?.transactionData?.paymentAmount}
        </Paragraph>
        <Paragraph>
          <strong>Payment Currency:</strong> {props?.transactionData?.paymentCurrency}
        </Paragraph>
        <Paragraph>
          <strong>Payment Date:</strong> {props?.transactionData?.paymentDate}
        </Paragraph>
        <Paragraph>
          <strong>Payment Method:</strong> {props?.transactionData?.paymentMethod}
        </Paragraph>
        <Paragraph>
          <strong>Payment User Role:</strong> {props?.transactionData?.paymentUserRole}
        </Paragraph>
        <Paragraph>
          <strong>Order ID:</strong> {props?.transactionData?.order_id}
        </Paragraph>
        {/* <Paragraph>
          <strong>Is Refunded:</strong> {props?.transactionData?.isRefunded}
        </Paragraph> */}
        {/* <Paragraph>
          <strong>Created At:</strong> {props?.transactionData?.createdAt}
        </Paragraph>
        <Paragraph>
          <strong>Updated At:</strong> {props?.transactionData?.updatedAt}
        </Paragraph> */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={props.onEdit}
          style={{ marginRight: "8px" }}
        >
          Edit
        </Button>
        <Button variant="contained" color="error" onClick={props.onDelete}>
          Delete
        </Button> */}
      </StyledCard>
    </CardRoot>
  );
}

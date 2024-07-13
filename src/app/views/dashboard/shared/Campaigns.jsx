import Box from "@mui/material/Box";
import { Small } from "app/components/Typography";
import { MatProgressBar, SimpleCard } from "app/components";

export default function Campaigns() {
  return (
    <Box>
      <SimpleCard title="Campaigns">
        <Small color="text.secondary">Today</Small>
        <MatProgressBar value={75} color="primary" text="DB Cooper (102k)" />
        <MatProgressBar value={45} color="secondary" text="Priority Pass (40k)" />
        <MatProgressBar value={75} color="primary" text="Others (80k)" />

        <Small color="text.secondary" display="block" pt={4}>
          Yesterday
        </Small>
        <MatProgressBar value={75} color="primary" text="DB Cooper (102k)" />
        <MatProgressBar value={45} color="secondary" text="Priority Pass (40k)" />
        <MatProgressBar value={75} color="primary" text="Others (80k)" />

        <Small color="text.secondary" display="block" pt={4}>
          Yesterday
        </Small>
        <MatProgressBar value={75} color="primary" text="DB Cooper (102k)" />
        <MatProgressBar value={45} color="secondary" text="Priority Pass (40k)" />
        <MatProgressBar value={75} color="primary" text="Others (80k)" />
      </SimpleCard>
    </Box>
  );
}

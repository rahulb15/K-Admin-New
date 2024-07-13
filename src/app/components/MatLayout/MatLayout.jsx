import { MatSuspense } from "app/components";
import useSettings from "app/hooks/useSettings";
import { MatLayouts } from "./index";

export default function MatLayout(props) {
  const { settings } = useSettings();
  const Layout = MatLayouts[settings.activeLayout];

  return (
    <MatSuspense>
      <Layout {...props} />
    </MatSuspense>
  );
}

import { Suspense } from "react";
import { MatLoading } from "app/components";

export default function MatSuspense({ children }) {
  return <Suspense fallback={<MatLoading />}>{children}</Suspense>;
}

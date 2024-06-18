import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";

export default function AuthGuard({ children }) {
  const { isAuthenticated,user } = useAuth();
  console.log(user);
  const { pathname } = useLocation();
  console.log(isAuthenticated);
  console.log(pathname);

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
}

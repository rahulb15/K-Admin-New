import { Navigate, useLocation, Outlet } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";

export default function AuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();

  console.log(user);
  console.log(isAuthenticated);
  console.log(pathname);

  if (!isAuthenticated) {
    return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
  }

  // Conditionally render based on user role
  if (user.role === 'user') {
    console.log("user");
    // Admin-specific routes or elements can be rendered here
    return <>{children}</>;
  }

  if (user.role === 'superadmin') {
    // Superadmin-specific routes or elements can be rendered here
    return <>{children}</>;
  }

  // If user role doesn't match, navigate to a not found page or unauthorized page
  return <Navigate replace to="/session/404" />;
}

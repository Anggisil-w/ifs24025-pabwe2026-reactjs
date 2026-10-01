import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";
import { asyncGetProfile } from "../../users/states/action";
import { asyncLogout } from "../../auth/states/action";

export default function LostFoundLayout() {
  const { token, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    dispatch(asyncGetProfile()).then((ok) => { if (!ok) dispatch(asyncLogout()); });
  }, [token, dispatch]);

  if (!token) return <Navigate to="/auth/login" replace />;

  const logout = async () => { await dispatch(asyncLogout()); navigate("/auth/login"); };

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarComponent name={user?.name} onLogout={logout} />
      <div className="flex flex-1 flex-col md:flex-row">
        <SidebarComponent />
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

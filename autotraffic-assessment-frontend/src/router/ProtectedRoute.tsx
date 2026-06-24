import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = Boolean(localStorage.getItem("token"));
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
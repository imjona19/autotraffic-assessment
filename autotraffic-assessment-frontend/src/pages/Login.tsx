import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
      <div className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Task<span className="text-[#254bdc]">Assessment</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Inicia sesión para continuar
          </p>
        </div>
        <LoginForm />
        <p className="text-sm text-gray-500 text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-[#254bdc] font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
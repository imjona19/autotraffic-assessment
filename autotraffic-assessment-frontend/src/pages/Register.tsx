import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
      <div className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Task<span className="text-[#254bdc]">Flow</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Crea tu cuenta para empezar</p>
        </div>
        <RegisterForm />
        <p className="text-sm text-gray-500 text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#254bdc] font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
      <div className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Task<span className="text-[#254bdc]">Flow</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Inicia sesión para continuar
          </p>
        </div>
        <LoginForm />
        <p className="text-xs text-gray-400 text-center mt-4">
          Demo: juan@example.com / 123456
        </p>
      </div>
    </div>
  );
}
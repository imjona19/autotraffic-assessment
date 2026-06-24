import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import Input from "../ui/Input";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Completa todos los campos");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsSubmitting(true);

        try {

        await authApi.register({ name, email, password });

        const success = await login({ email, password });

        if (success) {
            toast.success(`¡Bienvenido, ${name}!`);
            navigate("/dashboard");
        } 
        else {
            toast.success("Cuenta creada. Inicia sesión para continuar.");
            navigate("/login");
        }
        } 
        catch (err: any) {
            const message = err.response?.data?.message || "No se pudo crear la cuenta";
            setError(message);
        } 
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                id="name"
                label="Nombre completo"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                id="email"
                label="Correo electrónico"
                type="email"
                placeholder="juan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="password"
                label="Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
        </form>
    );
}
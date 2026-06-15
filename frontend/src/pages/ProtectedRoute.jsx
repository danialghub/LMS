import { Navigate, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react';

function ProtectedRoute({ children, requiredRole }) {
    const { authUser, token } = useAuthStore();
    const navigate = useNavigate();



    useEffect(() => {
        if (requiredRole && authUser?.role !== requiredRole) {
            navigate(-1);
        }

    }, [authUser, requiredRole, navigate]);

    if (!token) return <Navigate to={`/login/${requiredRole}`} />;

    return children;
}

export default ProtectedRoute
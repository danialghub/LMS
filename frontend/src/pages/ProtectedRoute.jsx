import { Navigate, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react';

function ProtectedRoute({ children, requiredRole }) {
    const { authUser, token, isCheckingAuth, isLoggedOut } = useAuthStore();
    const navigate = useNavigate();


    useEffect(() => {
        if (isCheckingAuth) return
        if (token && requiredRole && authUser?.role !== requiredRole) {
            navigate('/unauthorized');
        }

    }, [authUser, requiredRole, navigate]);

    if (!isCheckingAuth && !isLoggedOut && !token) return <Navigate to={`/login/${requiredRole}`} />;

    return children;
}

export default ProtectedRoute
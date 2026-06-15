import { Navigate, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore'


function ProtectedRoute({ children, requiredRole }) {
    const { authUser, token } = useAuthStore();

    if (!authUser?._id) {
        return <Navigate to={`/login/${requiredRole || ''}`} replace />;
    }

    if (requiredRole && authUser?.role !== requiredRole) {


        return <Navigate to="/unauthorized" replace />;
    }



    return children;
}

export default ProtectedRoute
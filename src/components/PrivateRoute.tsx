import { PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }: PropsWithChildren) => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        console.log("AuthContext is undefined");
        return <Navigate to='/login' />;
    } else {
        const { token, loading } = authContext
        if (!loading) {
            return token ? children : <Navigate to="/login" />;
        }
    }
};

export default PrivateRoute;

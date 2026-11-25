// src/pages/Login.jsx
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <SignIn 
        path="/login" 
        routing="path"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
};

export default Login;

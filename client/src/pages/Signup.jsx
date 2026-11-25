// src/pages/Signup.jsx
import { SignUp } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <SignUp 
        path="/signup" 
        routing="path"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
};

export default Signup;

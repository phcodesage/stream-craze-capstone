import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../styles/SignupPage.css';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';

function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data) => {
    console.log('Form data:', data);
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (result.success) {
        setIsSuccessful(true);
        setMessage('Signup successful! You will be redirected to login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setIsSuccessful(false);
        setMessage(result.error);
      }
    } catch (error) {
      setIsSuccessful(false);
      setMessage('An error occurred. Please try again later.');
      console.error('There was an error signing up:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
     finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container-fluid bg-dark vh-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-6 col-sm-10">
          <div className="card text-white bg-dark mb-3">
            <div className="card-body text-center">
              <img src="../logo@2x.png" style={{ width: '185px' }} alt="logo" />
              <h5 className="mt-1 mb-5 pb-1">Look for your favorite movies</h5>
              <p className="mb-4">Sign up to create your free account</p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("name", { required: "Full Name is required" })}
                  className="form-control mb-4 bg-secondary text-white"
                  placeholder='Full Name'
                />
                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                <input
                      {...register("username", { required: "Username is required" })}
                      className="form-control mb-4 bg-secondary text-white"
                      placeholder='Username'
                    />
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}

                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email address"
                        }
                      })}
                      className="form-control mb-4 bg-secondary text-white"
                      placeholder='Email address'
                      type='email'
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}



                <input
                  {...register("password", { required: "Password is required" })}
                  className="form-control mb-4 bg-secondary text-white"
                  placeholder='Password'
                  type='password'
                />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}

                <button
                    type="submit"
                    className="btn btn-primary w-100 mb-2 btn-signup"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Sign up'}
                  </button>

              </form>

              <p>or</p>
              <button className="btn btn-light w-100 mb-4">Sign up with Google</button>

              <div className="d-flex justify-content-center mb-4">
                <p className="mb-0 me-2">Already have an account?</p>
                <Link to="/login" className="btn btn-outline-danger login-btn">
                  Log in
                </Link>
              </div>

              {message && (
                <div className={isSuccessful ? "alert alert-success" : "alert alert-danger"}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

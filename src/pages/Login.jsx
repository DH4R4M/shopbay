import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const { email, password } = data;

    
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = existingUsers.find((user) => user.email === email && user.password === password);

        if (!user) {
            Swal.fire('Error', 'Invalid email or password', 'error');
            return;
        }

        Swal.fire('Success', 'Login successful', 'success').then(() => {
            navigate('/');
        });
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Login</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    {...register('email', { required: 'Email is required' })}
                                    placeholder="name@example.com"
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingPassword">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    {...register('password', { required: 'Password is required' })}
                                    placeholder="Password"
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </div>
                            <div className="my-3">
                                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link></p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;

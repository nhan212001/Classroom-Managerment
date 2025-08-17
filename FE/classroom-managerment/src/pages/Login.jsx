import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { checkUserForLogin, loginOtp, loginPassword } from "../apis/authApi";
import { USER_ROLE } from "../common/constant";
import { selectErrorAuth, selectLoadingAuth, selectLoggedIn, selectPhone, selectRole } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AuthStep = {
    USERNAME: 'username',
    PASSWORD: 'password',
    OTP: 'otp'
};

const Login = () => {
    const [form, setForm] = useState({ userName: "", password: "", otp: "" });
    const [error, setError] = useState("");
    const [loginState, setLoginState] = useState(AuthStep.USERNAME);

    const dispatch = useDispatch();
    const loading = useSelector(selectLoadingAuth);
    const userRole = useSelector(selectRole);
    const phone = useSelector(selectPhone);
    const loggedIn = useSelector(selectLoggedIn);
    const err = useSelector(selectErrorAuth);
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole) {
            if (userRole === USER_ROLE.INSTRUCTOR) {
                setLoginState(AuthStep.OTP);
            } else {
                setLoginState(AuthStep.PASSWORD);
            }
        }
    }, [userRole]);

    useEffect(() => {
        if (loggedIn) {
            navigate('/dashboard');
        }
    }, [loggedIn]);

    useEffect(() => {
        setError(err);
    }, [err]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        setError("");

        if (loginState === AuthStep.USERNAME) {
            if (!form.userName) {
                setError("Please enter your phone or email.");
                return;
            }
            dispatch(checkUserForLogin(form.userName))
        } else if (loginState === AuthStep.PASSWORD) {
            if (!form.password) {
                setError("Please enter your password.");
                return;
            }
            dispatch(loginPassword({ userName: form.userName, password: form.password }))
        } else if (loginState === AuthStep.OTP) {
            if (!form.otp) {
                setError("Please enter the OTP sent to your phone.");
                return;
            }
            dispatch(loginOtp({ userName: form.userName, otp: form.otp }))
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded-lg flex flex-col items-center">
            {
                loginState === AuthStep.USERNAME ? (
                    <div className="w-full">
                        <h1 className="text-2xl text-center font-bold mb-4">Sign In</h1>
                        <h1 className="text-center text-xl text-gray-600 mb-4">Please enter your phone or email to sign in</h1>
                        <input
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border border-gray-300 rounded"
                            placeholder="phone or email"
                            disabled={loading}
                        />
                    </div>
                ) : loginState === AuthStep.PASSWORD ? (
                    <div className="w-full">
                        <h1 className="text-2xl text-center font-bold mb-4">Sign In</h1>
                        <h1 className="text-center text-xl text-gray-600 mb-4">Please enter your password to sign in</h1>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border border-gray-300 rounded"
                            placeholder="password"
                            disabled={loading}
                        />
                    </div>
                ) : (
                    <div className="w-full">
                        <h1 className="text-2xl text-center font-bold mb-4">Phone verification</h1>
                        <h1 className="text-center text-xl text-gray-600 mb-4">Please enter the OTP sent to {phone}</h1>
                        <input
                            type="text"
                            name="otp"
                            value={form.otp}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border border-gray-300 rounded"
                            placeholder="OTP"
                            disabled={loading}
                        />
                    </div>
                )
            }
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </div>
    );
};

export default Login;
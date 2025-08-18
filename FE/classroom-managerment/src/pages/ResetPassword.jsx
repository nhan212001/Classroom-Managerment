import { useEffect, useState } from "react";
import { resetPassword } from "../apis/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const ResetPassword = () => {
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // useEffect(() => {
    //     dispatch(logout());
    // }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleConfirm = async () => {
        setLoading(true);
        if (!form.password || !form.confirmPassword) {
            toast.error("Both fields are required");
            setLoading(false);
            return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }
        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }
        try {
            await resetPassword(token, form.password);
            toast.success("Password reset successful");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded-lg flex flex-col items-center">
            <div className="w-full">
                <h1 className="text-2xl text-center font-bold mb-4">Reset Password</h1>
                <h1 className="text-center text-xl text-gray-600 mb-4">Please enter your password</h1>
                <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    placeholder="Enter your new password"
                    disabled={loading}
                    type="password"
                />
                <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    placeholder="Confirm your new password"
                    type="password"
                    disabled={loading}
                />
                <button
                    onClick={handleConfirm}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;

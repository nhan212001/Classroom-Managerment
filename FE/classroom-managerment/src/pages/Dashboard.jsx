import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectRole } from "../slices/authSlice";
import { USER_ROLE } from "../common/constant";
import { openProfilePopup } from "../slices/popupSlice";

const Dashboard = () => {
    const role = useSelector(selectRole);
    const dispatch = useDispatch();

    const handleOpenProfile = () => {
        dispatch(openProfilePopup());
    }

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="h-16 flex items-center justify-center font-bold text-xl border-b">Menu</div>
                <nav className="flex-1 p-4 space-y-2">
                    {role === USER_ROLE.INSTRUCTOR && (
                        <>
                            <Link to="manage-student" className="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700 font-medium">Manage Students</Link>
                            <Link to="manage-lesson" className="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700 font-medium">Manage Lesson</Link>
                        </>
                    )}
                    <Link to="manage-enrollment" className="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700 font-medium">Manage Enrollment</Link>
                    <Link to="message" className="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700 font-medium">Message</Link>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow flex items-center px-8 font-bold text-lg border-b justify-between">
                    <span>Classroom Managerment</span>
                    <div className="relative group">
                        <button className="flex items-center focus:outline-none">
                            <img
                                src="/image.png"
                                alt="avatar"
                                className="w-9 h-9 rounded-full border mr-2"
                            />
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
                            <button onClick={handleOpenProfile} className="block pr-5 text-right py-2 w-full text-gray-700 hover:bg-gray-100">Profile</button>
                            <button onClick={handleLogout} className="block pr-5 text-right py-2 w-full text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

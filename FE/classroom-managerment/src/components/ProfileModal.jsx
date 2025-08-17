import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../slices/authSlice";
import { closeProfilePopup, selectProfilePopupOpen } from "../slices/popupSlice";
import { toast } from "react-toastify";
import { validateEmail } from "../common/common";
import { editUser } from "../apis/userApi";
import { selectLoadingStudents } from "../slices/studentSlice";

const ProfileModal = () => {
    const user = useSelector(selectUser)
    const isOpen = useSelector(selectProfilePopupOpen)
    const loading = useSelector(selectLoadingStudents)

    const dispatch = useDispatch();
    const [profile, setProfile] = useState(user || { id: '', name: '', email: '', phone: '' });

    useEffect(() => {
        setProfile(user);
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!profile?.name || !profile?.email) {
            toast.error("Name and email are required");
            return;
        }
        if (!validateEmail(profile.email)) {
            toast.error("Invalid email format");
            return;
        }
        try {
            await dispatch(editUser(profile)).unwrap().then(res => {
                dispatch(setUser(res));
                toast.success("Profile updated successfully");
            })
        }
        catch (error) {
            console.log('Error updating profile:', error);
        }
    };

    const handleClose = () => {
        dispatch(closeProfilePopup());
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Profile"
            className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md mx-auto mt-32 outline-none"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
            <h3 className="text-lg font-bold mb-4">Profile</h3>
            <div className="flex flex-col gap-3">
                <input
                    className="border p-2 rounded"
                    name="name"
                    value={profile?.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input
                    className="border p-2 rounded"
                    name="email"
                    value={profile?.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    className="border p-2 rounded"
                    name="phone"
                    value={profile?.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button onClick={handleClose} className="px-4 py-1 rounded border">Cancel</button>
                <button onClick={handleSave} disabled={loading || !profile?.name || !profile?.email} className="px-4 py-1 rounded bg-blue-500 text-white">Save</button>
            </div>
        </Modal>
    );
};

export default ProfileModal;

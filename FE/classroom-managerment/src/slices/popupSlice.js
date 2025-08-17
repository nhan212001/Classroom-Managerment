import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpenProfilePopup: false,
    // isOpenConfirmPopup: false,
    // confirmMessage: '',
    // onConfirm: () => { },
    // onCancel: () => { },
};

const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        openProfilePopup: (state) => {
            state.isOpenProfilePopup = true;
        },
        closeProfilePopup: (state) => {
            state.isOpenProfilePopup = false;
        },
        // openConfirmPopup: (state, action) => {
        //     state.isOpenConfirmPopup = true;
        //     state.confirmMessage = action.payload?.message || '';
        //     state.onConfirm = action.payload?.onConfirm || (() => { });
        //     state.onCancel = action.payload?.onCancel || (() => { });
        // },
        // closeConfirmPopup: (state) => {
        //     state.isOpenConfirmPopup = false;
        //     state.confirmMessage = '';
        //     state.onConfirm = () => { };
        //     state.onCancel = () => { };
        // },
    },
});

export const { openProfilePopup, closeProfilePopup } = popupSlice.actions;
export const selectProfilePopupOpen = (state) => state.popup.isOpenProfilePopup;
// export const selectConfirmPopupOpen = (state) => state.popup.isOpenConfirmPopup;
// export const selectConfirmPopupMessage = (state) => state.popup.confirmMessage;
// export const selectConfirmPopupActions = (state) => ({
//     onConfirm: state.popup.onConfirm,
//     onCancel: state.popup.onCancel,
// });

export default popupSlice.reducer;

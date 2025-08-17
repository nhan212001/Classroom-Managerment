const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^\d{9,15}$/;
    return re.test(phone);
};

export { validateEmail, validatePhone };
export default function validateUser(username: string, password: string) {
    if (username.length < 6) throw new Error("The username must be at least 6 characters long");
    if (password.length < 8) throw new Error("The password must be at least 8 characters long");

    if (username.length > 40) throw new Error("The username can't be more than 40 characters long");
    if (password.length > 40) throw new Error("The password can't be more than 20 characters long");

    return
};
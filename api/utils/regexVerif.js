export const checkExtension = picture => {
    const format = ['jpg', 'jpeg', 'png'];
    const ext = picture.split(';')[0].split('/')[1];
    const defaultPicture = "https://www.assises-orl.fr/wp-content/uploads/2016/06/user-default.png";
    return (format.indexOf(ext) > -1 || picture === defaultPicture) ? true : false;
}

export const checkName = (name) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/;
    return regex.test(name) ? true : false;
}

export const checkUsername = (username) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-0-9-]{5,15}$/;
    return regex.test(username) ? true : false;
}

export const checkPassword = (password) => {
    const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
    return regex.test(password) ? true : false;
}

export const checkEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(String(email).toLowerCase());
}
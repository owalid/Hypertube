export const verifParams = (obj, nb) => {
    let i = 0;
    for (let key in obj) {
        if (obj[key] === "" || obj[key] === null)
            return false
        i++;
    }
    return i == nb ? true : false;
}

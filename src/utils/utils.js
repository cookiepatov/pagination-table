const cloneObject = (original, level) => {
    const newObj = Object.assign({}, original);
    level--;
    if (level) {
        Object.keys(original).forEach(key => {
            newObj[key] = cloneObject(original[key], level)
        })
    }
    return newObj;
}


const cloneData = (original) => {
    const newObj = Object.assign({}, original);
    Object.keys(original).forEach(key => {
        newObj[key] = original[key].slice();
    })
    return newObj;
}

export {cloneObject, cloneData}
const cloneData = (original) => {
    const newObj = Object.assign({}, original);
    Object.keys(original).forEach(key => {
        newObj[key] = original[key].slice();
    })
    return newObj;
}

export {cloneData}
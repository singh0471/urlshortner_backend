const isPositiveInteger = (num) => {
    console.log(Number.isInteger(num))
    if (Number.isInteger(num) && num > 0) {
        return true
    }
    return false
}

const isPositiveNumber = (num) => {
    console.log(typeof num === 'number' && !isNaN(num)) 
    if (typeof num === 'number' && !isNaN(num) && num > 0) {
        return true;
    }
    return false;
}


const getUniqueNumber = () => (Date.now());

module.exports = { isPositiveNumber,isPositiveInteger, getUniqueNumber }
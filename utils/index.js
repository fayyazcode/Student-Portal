const validator = require("validator")

const resWrapper = (message, status, data, error = null) => {
    if (error) {
        return {
            message,
            status,
            error
        }
    }

    return {
        message,
        status,
        data
    }
};


const getQuarterDates = (quarter, year = new Date().getFullYear()) => {
    let startDate, endDate;
    switch (quarter) {
        case 'Q1':
            startDate = new Date(`${year}-01-01`);
            endDate = new Date(`${year}-03-31`);
            break;
        case 'Q2':
            startDate = new Date(`${year}-04-01`);
            endDate = new Date(`${year}-06-30`);
            break;
        case 'Q3':
            startDate = new Date(`${year}-07-01`);
            endDate = new Date(`${year}-09-30`);
            break;
        case 'Q4':
            startDate = new Date(`${year}-10-01`);
            endDate = new Date(`${year}-12-31`);
            break;
        default:
            startDate = null;
            endDate = null;
    }
    return { startDate, endDate };
};



const isValidUuid = (id, res) => {
    if (!validator.isUUID(id)) {
        res.status(400).send(resWrapper("Invalid ID format", 400, null, "ID is not a valid UUID"));
        return false;
    }
    return true;
};

module.exports = { resWrapper, getQuarterDates, isValidUuid }
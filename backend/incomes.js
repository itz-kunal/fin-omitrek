const User = require('./schemas.js');

async function updRefIncome(data, couponWorth) {
    try {
        const userIdToFind = data._id;
        // Find all users who contain the referral
        const userReferrals = await User.find({
            'referrals._id': userIdToFind
        });
        const User = require('./schemas.js');

async function updRefIncome(data, couponWorth) {
    try {
        const userIdToFind = data._id;
        // Find all users who contain the referral
        const userReferrals = await User.find({
            'referrals._id': userIdToFind
        });

        for (const user of userReferrals) {
            const refIndex = user.referrals.findIndex(referral => referral._id == userIdToFind);
            const level = user.referrals[refIndex].level;

            // Calculate earnings based on referral level
            const earningPercentage = await getEarningPercentage(level);
            user.earning = user.earning + couponWorth * earningPercentage / 100 || 0;

            // Save each user individually
            await user.save();
        }
    } catch (err) {
        throw err;
    }
}

function getEarningPercentage(level) {
    const percentageMap = {
        1: 10,
        2: 5,
        3: 3,
        4: 2,
        5: 1
    };
    return percentageMap[level] || 0;
}

module.exports = updRefIncome;

    } catch (err) {
        throw err;
    }
}
function getEarningPercentage(level) {
    const percentageMap = {
        1: 10,
        2: 5,
        3: 3,
        4: 2,
        5: 1
    };
    return percentageMap[level] || 0;
}

module.exports=updRefIncome

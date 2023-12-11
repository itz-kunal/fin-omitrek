const User = require('./schemas.js');

async function updRefIncome(data, couponWorth) {
    try {
        const userIdToFind = data._id;
        // Find all users who contain the referral
        const userReferrals = await User.find({
            'referrals._id': userIdToFind
        });
        userReferrals.forEach(async (i) => {
            const refIndex = i.referrals.findIndex(referral => referral._id == userIdToFind);
            const level = i.referrals[refIndex].level;

            // Calculate earnings based on referral level
            const earningPercentage = getEarningPercentage(level);
            i.earning = i.earning + couponWorth * earningPercentage / 100 || 0;
        });
        // Save all the users in one go
        await Promise.all(userReferrals.map(user => user.save()));
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

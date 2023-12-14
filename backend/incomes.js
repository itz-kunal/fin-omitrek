const User = require('./schemas.js');

async function updRefIncome(data, couponWorth) {
    try {
        const userIdToFind = data._id;
        // Find all users who contain the referral
        const userReferrals = await User.find({
            'referrals._id': userIdToFind
        });
        for (const user of userReferrals) {
            if (hasCouponsWorthMore(user, couponWorth)) {
                const refIndex = user.referrals.findIndex(referral => referral._id == userIdToFind);
                const level = user.referrals[refIndex].level;

                // Calculate earnings based on referral level
                const earningPercentage = await getEarningPercentage(level);
                user.earning = user.earning + couponWorth * earningPercentage / 100 || 0;

                // Save each user individually
                await user.save();
            }
        }
    } catch (err) {
        throw err;
    }
}

function getEarningPercentage(level) {
    const percentageMap = {
        1: 10,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    return percentageMap[level] || 0;
}

function hasCouponsWorthMore(user, couponWorth) {
    if (user && user.coupons && user.coupons.length > 0) {
        // Check if any coupon is worth more than couponWorth
        return user.coupons.some(coupon => coupon.amount >= couponWorth && coupon.status == 'approved');
    }
    return false;
}


module.exports = updRefIncome

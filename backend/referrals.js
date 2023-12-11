const User = require('./schemas.js')

module.exports = async function addRefData(userData,userReferredBy, level = 1) {
    if (userReferredBy !== "" && level <= 5) {
        try {
            let refByUserdata = await User.findOne({ referralCode: userReferredBy });
            if (refByUserdata) {
                const addRefD = {
                    _id: userData._id,
                    date: userData.registrationDate,
                    name: userData.name,
                    email: userData.email,
                    position: userData.position,
                    level: level
                };

                refByUserdata.referrals.push(addRefD);
                await refByUserdata.save();
                const recUserRefby = refByUserdata.referredBy ;
                // Recursively call the function for the next level
                return addRefData(userData,recUserRefby,level + 1);
            } else {
                console.error("Referred user not found");
            }
        } catch (error) {
            console.error("Error updating referral data:", error);
        }
    }
}
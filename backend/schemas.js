const mongoose = require('mongoose');

// Get time in proper way
const formattedDateTime = (currentDateTime) => {
    const dateObject = new Date(currentDateTime);
    const day = dateObject.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return `${day} ${monthNames[monthIndex]} ${year}, ${hours}:${minutes}`;
};

// Define Mongoose Schemas
const couponSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, default:new mongoose.Types.ObjectId },
    upi: { type: String},
    amount: { type: Number },
    status: { type: String, default: 'pending' },
    date: { type: String, default: formattedDateTime(Date.now()) }
})
const withdrawlSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, default:new mongoose.Types.ObjectId },
    upi: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Processing' },
    date: { type: String, default: formattedDateTime(Date.now()) }
});
const referralSchema= new mongoose.Schema({
    _id:String,
    date:{type:String, default: formattedDateTime(Date.now())},
    name:String,
    email:String,
    coupons:[couponSchema],
    position:String,
    level:Number
})
const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    phone: { type: Number, require: true },
    email: { type: String},
    address:String,
    state:String,
    country:String,
    userInfo:{type:String},
    password: { type: String, require: true },
    referredBy: String,
    referralCode: { type: String, require: true },
    position: String,   
    coupons: [couponSchema],
    earning:{type:Number,default:0},
    balance:{type:Number,default:0},
    referrals:[referralSchema],
    registrationDate: { type: String, default: formattedDateTime(Date.now()) },
    withdrawls: [withdrawlSchema]
});

const User = mongoose.model('User', userSchema);
module.exports=User;
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path')
const app = express();
const User = require('./backend/schemas.js');
const{sendOTP,verifyOTP}=require('./backend/otp.js');
const addRefData = require('./backend/referrals.js');
const updRefIncome = require('./backend/incomes.js');

const port = 80;
app.use(session({
    secret: 'Omi_trek&@79127#$',
    resave: true,
    saveUninitialized: true
}));
// Middleware to check if the User is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
};

app.use('/styles', express.static(path.join(__dirname, 'styles')))
app.use('/def-assets', express.static(path.join(__dirname, 'def-assets')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/script', express.static(path.join(__dirname, 'script')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'home.html'))
})
app.get('/user', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'user.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'signupform.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'loginform.html'))
})
app.get('/otpform', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'otp.html'))
})
app.get('/forgotPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'forget.html'))
})
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'payment.html'));
})
app.get('/admin', isAuthenticated, (req, res) => {
    if (req.session.userId == 'Admin@123') {
        res.sendFile(path.join(__dirname, 'Admin_pannel', 'admin.html'))
    } else {
        res.send('You are not allowed to view this page')
    }
})
app.get('/paymentAmount', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'deposit.html'))
})

// post methods which require data fetching and etc
const dburl = 'mongodb://127.0.0.1:27017/omitrek'
const db = mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.once
app.use(bodyParser.urlencoded({
    extended: true
})); // for getting form data
app.use(bodyParser.json());

//for updating whole page
app.get('/updatePage', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    try {
        // if (userId !== 'Admin@123') {
        // }
        const userData = await User.findById(userId);
        if (userData) {
            res.json(userData)
        } else {
            res.send(`<script>alert('Something went wrong ! Please try again')</alert>`)
        }
    } catch (err) {
        console.log(err)
    }
})
//for updating sponser
app.get('/getSponser', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    try {
        const userReferredBy = await User.findById(userId).referredBy;
        if (userReferredBy) {
            const sponserData = await User.findOne({
                referralCode: userReferredBy
            })
            res.json(sponserData);
        } else {
            res.json({
                name: 'none',
                email: 'none',
                phone: 'none',
                country: 'none',
                userInfo: 'hey change the world through your simple steps'
            });
        }
    } catch (err) {
        console.log(err)
    }
})
// Register Endpoint
app.post('/register', async (req, res) => {
    const isuserExist = await User.find({
        phone: req.body.phone
    })
    if (isuserExist.length < 0) {
        res.send('User already exists')
    } else {
        try {
            const generatedReferralCode = await generateAndCheckReferralCode();
            async function generateAndCheckReferralCode() {
                while (true) {
                    const generatedReferralCode = generateRandomCode();
                    const existingCode = await User.findOne({
                        referralCode: generatedReferralCode
                    });

                    if (!existingCode) {
                        return generatedReferralCode;
                    }
                }
            }
            function generateRandomCode() {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                const codeLength = 12;
                let referralCode = '';
                for (let i = 0; i < codeLength; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    referralCode += characters.charAt(randomIndex);
                }
                return referralCode;
            }

            registerApplication = new User({
                referredBy: req.body.referredBy,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                position: req.body.position,
                referralCode: generatedReferralCode,
            });
            // userRefdata = req.body

            req.session.isRegistering = await true;
            req.session.phoneNo = await req.body.phone
            try {
                // await sendOTP(req.body.phone)
                // res.redirect('/otpForm')
                registerApplication.save()
                // res.redirect('/user')
                res.redirect('/user?register=success');
                const userRefBy = registerApplication.referredBy  ;
                addRefData(registerApplication,userRefBy);
            } catch (err) {
                res.redirect('/register?success=err')
            }
            // console.log(req.session.phoneNo)
            // res.redirect('/otpForm')
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});
// Login Endpoint
app.post('/login', async (req, res) => {
    if (req.body.phone == 11111111111 && req.body.password == '&@Omi&Admin23#%?') {
        req.session.isAuthenticated = true
        req.session.userId = 'Admin@123'
        res.redirect('/admin')
    } else {
        try {
            const user = await User.findOne({
                phone: req.body.phone
            });

            if (user) {
                if (req.body.password === user.password) {
                    req.session.userId = user._id;
                    req.session.isAuthenticated = true;
                    res.redirect('/user')
                } else {
                    res.send('<script>alert("Wrong Password"); window.location.href = "/";</script>');
                }
            } else {
                res.send('<script>alert("User does not exist"); window.location.href = "/";</script>');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Withdrawal Request Endpoint
app.post('/withdrawlsReq',isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);

        if (user) {
            const reqData = req.body;
            user.withdrawls.push(reqData);
            console.log(user.withdrawls)
            await user.save();
            res.send('<script>alert("Withdrawal request submitted successfully"); window.location.href = "/user";</script>');
        } else {
            res.status(404).send('<script>alert("User not found"); window.location.href = "/";</script>');
        }
    } catch (err) {
        console.error(err,req.body);
        res.status(500).send('<script>alert("Something went wrong. Please try again."); window.location.href = "/";</script>');
    }
});
// Profile Update Endpoint
app.post('/updateProfile', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    const updatedProfile = req.body; // Assuming the request body contains the updated profile data

    try {
        const user = await User.findByIdAndUpdate(userId, updatedProfile, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // user.save()
        console.log('done',user,updatedProfile)
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Password Update Endpoint
app.post('/updatePassword', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the old password matches the stored password
        if (user.password !== oldPassword) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Set password
app.post('/setPassword',isAuthenticated,async (req,res)=>{
    const userId = req.session.userId;
    try{
        const user=await User.findById(userId);
        if(!user){
            res.json(`user doesn't exist`)
        }
        user.password=req.body.password
        await user.save()
        res.redirect('/user')
    }catch(err){
        res.send(`<script>alert('Something went wrong please try again');window.location.href='/';</script>`)
    }
})
//Buy copuns
app.post('/buyCopun',isAuthenticated,async (req,res)=>{
    const userId = req.session.userId;  
    try{
        const user=await User.findById(userId);
        if(!user){
            res.status(404).send(`user doesn't exist`)
        }
        // couponData = req.body
        user.coupons.push(req.body)
        await user.save()

        lastCoupon = user.coupons[user.coupons.length - 1];
        // console.log(user)   
        res.redirect(`/payment?amount=${req.body.amount}`)
        const userrefBy = await User.updateMany(
            { 'referrals._id': userId },
            { $push: { 'referrals.$.coupons': lastCoupon } }
        );
    }catch(err){
        // res.send(`<script>alert('Something went wrong please try again');</script>`)
        console.log(err)
    } 
})

app.get('/updAdmin',isAuthenticated,async(req,res)=>{
    try {
        const users = await User.find({});
        res.json(users)
      } catch (error) {
        console.error('Error:', error);
        throw error; // Handle the error appropriately in your application
      }
})
app.post('/updStat',isAuthenticated,async(req,res)=>{
    try {
        const user = await User.findOne({
          [req.body.findIn+'._id']:req.body.Id
        });
        const coupId = req.body.Id;
       // Find the index of the coupon in the array
       const cngArray=req.body.findIn;
        if(cngArray=='coupons'){
            couponIndex = user.coupons.findIndex(
                (coupon) => coupon._id.toString() === req.body.Id);
            user.coupons[couponIndex].status = req.body.stat;
            updtCopun=user.coupons[couponIndex]
            // lastCoupon.status=req.body.stat
            const userrefBy = await User.updateMany(
                { 'referrals._id': coupId },
                { $push: { 'referrals.$.coupons': updtCopun } }
            );
            let copunWorth = user.coupons[couponIndex].amount;
            updRefIncome(user,copunWorth)
        }else if(cngArray=='withdrawls'){
            couponIndex=user.withdrawls.findIndex(
            (coupon)=> coupon._id.toString() === req.body.Id)
          user.withdrawls[couponIndex].status = req.body.stat;
          user.earning = user.earning - user.withdrawls[couponIndex].amount
       }
      // Check if the coupon is found
      if (couponIndex === -1) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Coupon status updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/verifyOtp',async(req,res)=>{
    console.log('hui bui otp',req.body.otp,req.session.isRegistering)
    const verify =await verifyOTP(req.session.phoneNo,req.body.otp)
    if(verify){
        if(req.session.isRegistering){
            await registerApplication.save();
            req.session.userId = registerApplication._id;
            req.session.isAuthenticated=true;
            res.redirect('/user?register=success');
            const userRefBy = registerApplication.referredBy  ;
            addRefData(registerApplication,userRefBy);
            req.session.isRegistering=false;
        }else{
            try {
                const user = await User.findOne({ phone: req.session.phone });
        
                if (user) {
                        req.session.userId = user._id;
                        req.session.isAuthenticated = true;
                        res.redirect('/user?login=success')
                } else {
                    res.send('<script>alert("User does not exist"); window.location.href = "/";</script>');
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        }
    }
    else if(verify == 'expireOtp'){
        res.redirect('/otpform?otp=expire')
    }else{
        res.redirect('/otpform?otp=invalid')
    }
})
app.post('/forgotPass',async(req,res)=>{
    try{
        await sendOTP(req.body.phone)
        req.session.phoneNo=req.body.phone
        res.redirect('/otpForm')
    }catch(err){console.log(err);res.send('something went wrong try again')}
})
app.post('/resendOtp',async(req,res)=>{
    await sendOTP(req.session.phoneNo)
})

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});

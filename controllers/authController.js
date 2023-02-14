import User from "../models/userSchema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import mailHelper from "../utils/mailHelper"
import crypto from 'crypto'
export const cookieOptions = {

}

/*
    @SIGNUP
    @route http://localhost:5000/api/auth/signup
    @description user signUp Controller for creating new user
    @parameters name,email,password
    @returns User Object
*/

export const signUp = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body
    if (!name || !email || !password) {
        throw new CustomError("Please fill all fields", 400)
    }
    // check if user exists
    const existingUser = await User.findOne({
        email
    })
    if (existingUser) {
        throw new CustomError('User alreay exits', 400)
    }
    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.getJwtToken()
    console.log(user);
    user.password = undefined

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        token,
        user
    })

})


/*
    @LOGIN
    @route http://localhost:5000/api/auth/login
    @description user login Controller for login new user
    @parameters email,password
    @returns User Object
*/


export const login = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) {
        throw new CustomError("Please fill all fields", 400)
    }
    const user = await User.findOne({
        email
    }).select("+password")

    if (!user) {
        throw new CustomError("Invalid credentilas", 400)
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (isPasswordMatched) {
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError('Invalid credentilals - pass', 400)
})


/*
    @LOGOUT
    @route http://localhost:5000/api/auth/logout
    @description user logout Controller for logout  user
    @parameters 
    @returns success message
*/

export const logout = asyncHandler(async (req, res) => {
    // res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})


/*
    @FORGOT_PASSWORD
    @route http://localhost:5000/api/auth/forgot
    @description user will submit email and we will generate
    @parameters  email
    @returns success message
*/


export const forgotPassword = asyncHandler(async (req, res) => {
    const {
        email
    } = req.body
    // check email for null or ""

    const user = User.findOne({
        email
    })
    if (!user) {
        throw new CustomError("User not found", 404)
    }

    const resetToken = user.generateForgotPasswordToken()
    await user.save({
        validateBeforeSave: false
    })
    const resetUrl =
        `${req.protocol}://${req.get("host")}/api/auth/password/reset${resetToken}`
    const text = `Your password reset links is
        \n\n ${resetUrl} \n\n   
    `
    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email for website",
            text: text,
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    } catch (error) {
        // roll back - clear fields and save

        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        throw new CustomError(error.message || 'Email send failure', 500)

    }

})


/*
    @RESET PASSWORD
    @route http://localhost:5000/api/auth/reset/:resetToken
    @description user will submit email and we will generate
    @parameters  email
    @returns success message
*/

export const resetPassword = asyncHandler(async (req, res) => {

    const {
        token: resetToken
    } = req.params
    const {
        password,
        confirmPassword
    } = req.body
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    const User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {
            $gt: Date.now()
        }
    })

    if (!user) {
        throw new CustomError('Password token is invalid or expired', 400)
    }
    if (password !== confirmPassword) {
        throw new CustomError('Password and conf password does not match', 400)
    }
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    //   create token  and send as response
    const token = user.getJwtToken()
    user.password = undefined
    // helper method for cookie cand be added
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
        success: true,
        user
    })
})

// TODO:create a controller for change password





/*
    @GET PRFOILE
    @route http://localhost:5000/api/auth/profile
    @description check token and populate req.user
    @parameters  
    @returns User Object

*/

export const getProfile = asyncHandler(async (req, res) => {
    const {user} = req
    if(!user){
        throw new CustomError('User not found',404)
    }
    res.status(200).json({
        success:true,
        user
    })
})
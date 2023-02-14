import User from "../models/userSchema"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import config from "../config"

export const isLoggedIn = asyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))

    )
    {
        token= req.cookies.token || req.headers.authorization.
        split()
    }
    if(!token){
        throw new CustomError('not authorized to access this route',401)

    }
    try {
      const decodedJwtPayload =  JWT.verify(token,config,JWT_SECRET)
        // id,find user based on id set this in req.user
      req.user = await  User.findById(decodedJwtPayload._id,"name email role")
      next()

    } catch (error) {
        throw new CustomError('not authorized to access this route',401)

    }
})  
import  Collection  from '../models/collectionSchema';
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"


export const createCollection = asyncHandler(async(req,res)=>{
    // take name from frontend
    const {name } = req.body

    if(!name){
        throw new CustomError("Collection name is required",400)
    }
    //add this name to datatbase
    const collection = await Collection.create({
        name
    })
    // send this response value to frontend
    res.status(200).json({
        success:true,
        message:"Collection created with success",
        collection
    })
})

export const updateCollection = asyncHandler(async(req,res)=>{
    // existing value to be updates
    const {id:collectionId} = req.params
    // new value to get updated
    const {name} = req.body
    if(!name){
        throw new CustomError("Collection name is required",400)
    }
    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name,
        },
        {
            new:true,
            runValidators:true
        }
    )
    if(!updatedCollection){
        throw new CustomError("Collection not found",400)
    }
    // send response to front end
    res.send(200).json({
        success:true,
        message:"Collection updated successfully",
        updatedCollection
    })
})


export const deleteCollection = asyncHandler(async(req,res)=>{
    const {id:collectionId} = req.params
    let deletedCollection = await Collection.findByIdAndDelete(
        collectionId
    )

    if(!deletedCollection){
        throw new CustomError("Collection not found",400)
    }
    deletedCollection.remove()
     // send response to front end
     res.send(200).json({
        success:true,
        message:"Collection deleted successfully",
    })

})


export const getAllCollection = asyncHandler(async(req,res)=>{
    const collections = await Collection.find()
    
    if(!collections){
        throw new CustomError("Collection not found",400)
    }
    
    res.send(200).json({
        success:true,
        message:"Collection fetched successfully",
        collections
    })
})

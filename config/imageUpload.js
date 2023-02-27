import s3 from "../config/s3Config"


export const s3FileUpload = async ({
    bucketName,
    key,
    body
}) => {
    return await s3.upload({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: contentType
        })
        .promise()
}

export const deleteFile = async ({bucketName,key})=>{

    return await s3.deleteObject({
        Bucket: bucketName,
        Key: key
    })

}
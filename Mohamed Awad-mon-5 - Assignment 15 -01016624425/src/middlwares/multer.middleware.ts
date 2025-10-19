import multer from 'multer'


export const uploadFile = () => {
    return multer({storage:multer.diskStorage({})})
}
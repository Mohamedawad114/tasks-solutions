import dayjs from "dayjs"
import Token from "../DB/models/refreshToke.model.js"
const today=dayjs().toDate()

async function deleteAll_EXTokens() {
  const deleted=  await Token.deleteMany({expireAt:{$lt:today}})
  if(deleted.deletedCount)console.log(`Deleted ${deleted.deletedCount} expired refresh tokens`)   
}


export default deleteAll_EXTokens
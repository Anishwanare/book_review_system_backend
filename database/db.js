import mongoose from "mongoose";

export const dbConnection = async () => {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("connected to database")
    }).catch((err) => {
        console.log(err)
    })
}

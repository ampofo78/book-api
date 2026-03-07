import * as Moongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const connection = await Moongoose.connect(process.env.MONGO_URI, {});
    console.log(connection.connection.host);
  } catch (error) {
    console.log("Error Connecting to Database", error);
    process.exit(1);
  }
};

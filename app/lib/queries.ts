import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

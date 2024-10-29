import mongoose from "mongoose";

const wishItemSchema = new mongoose.Schema( {
  _id: {type:String},
	wishId: { type: Number, required: true },
	wishDesc: { type: String, required: true },
	isCompleted: { type: Boolean, default: false },
	startDate: { type: Date, required: true },
	completeDate: { type: Date, default: null },
});

export const WishItem = mongoose.model( 'WishItem', wishItemSchema );

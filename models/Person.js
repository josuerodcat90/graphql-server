import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const personSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
		},
		age: {
			type: Number,
			required: true,
			minlength: 1,
		},
		phone: {
			type: String,
			required: false,
			minlength: 7,
		},
		street: {
			type: String,
			required: true,
			minlength: 3,
		},
		city: {
			type: String,
			required: true,
			minlength: 3,
		},
	},
	{
		timestamps: true,
		collection: 'persons',
	}
);

personSchema.plugin(uniqueValidator);
export default mongoose.model('Person', personSchema);

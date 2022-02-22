import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Person',
			},
		],
	},
	{
		timestamps: true,
		collection: 'users',
	}
);

export default mongoose.model('User', userSchema);

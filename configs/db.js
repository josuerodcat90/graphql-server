import mongoose from 'mongoose';

//mongoose connection
const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-server-midu';

export const connectDB = async () => {
	await mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log(`>>>Cloud DB is connected!<<<`);
		})
		.catch((e) => {
			console.error(`¡Something goes wrong!`);
			console.error(e);
		});
};

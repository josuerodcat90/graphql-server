import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/TypeDefs.js';
import { resolvers } from './graphql/Resolvers.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { connectDB } from './configs/db.js';
import User from './models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'th151smy53cr3tw0rd';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;

		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			const token = auth.substring(7);
			const decodedUser = jwt.decode(token, JWT_SECRET);

			if (!decodedUser) {
				return {};
			} else {
				const currentUser = await (
					await User.findById(decodedUser.id)
				).populate('friends');
				return { currentUser };
			}
		}
	},
});

server
	.listen({ port: process.env.PORT || 5000 })
	.then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
		connectDB();
	})
	.catch((err) => {
		console.error(err);
	});

import { AuthenticationError, UserInputError } from 'apollo-server';
import Person from '../models/Person.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'th151smy53cr3tw0rd';

export const resolvers = {
	Query: {
		personCount: async () => await Person.collection.countDocuments(),
		allPersons: async (root, args) => {
			const { hasPhone } = args;

			if (!hasPhone) {
				return Person.find({});
			}

			return Person.find({ phone: { $exists: hasPhone === 'YES' } });
		},
		findPerson: async (root, args) => {
			const { name } = args;

			return await Person.findOne({ name });
		},
		me: async (root, args, context) => {
			return context.currentUser;
		},
	},
	Person: {
		canDrink: (person) => {
			return person.age >= 18 ? 'YES!' : 'NOPE!';
		},
		address: (person) => {
			return {
				street: person.street,
				city: person.city,
			};
		},
		check: () => 'LOL',
	},
	Mutation: {
		addPerson: async (root, args, context) => {
			const { currentUser } = context;
			const { name, age, phone, street, city } = args;

			if (!currentUser) throw new AuthenticationError('Not authenticated');

			const newPerson = new Person({ name, age, phone, street, city });

			try {
				await newPerson.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return newPerson;
		},
		deletePerson: async (root, args, context) => {
			const { currentUser } = context;

			if (!currentUser) throw new AuthenticationError('Not authenticated');

			const { id } = args;

			let person = await Person.findById(id);

			if (!person) throw new UserInputError('Person not found');

			try {
				await Person.findOneAndDelete({ _id: id });
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return `Person deleted successfully`;
		},
		editNumber: async (root, args) => {
			const { name, phone } = args;
			const person = await Person.findOne({ name });

			if (!person) {
				throw new UserInputError('Person not found', {
					invalidArgs: args,
				});
			}

			person.phone = phone;

			try {
				await person.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return person;
		},
		createUser: async (root, args) => {
			const { username, email } = args;
			let password = jwt.sign(args.password, JWT_SECRET);

			const user = new User({ username, password, email });

			try {
				await user.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return user;
		},
		login: async (root, args) => {
			const { email, password } = args;
			const user = await User.findOne({ email });

			let decodedPassword = user ? jwt.decode(user.password, JWT_SECRET) : null;

			if (!user || password !== decodedPassword) {
				throw new UserInputError('Invalid credentials');
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return {
				value: jwt.sign(userForToken, JWT_SECRET),
			};
		},
		addAsFriend: async (root, args, context) => {
			const { currentUser } = context;

			if (!currentUser) throw new AuthenticationError('Not authenticated');

			const { name } = args;
			const person = await Person.findOne({ name });

			if (!person) {
				throw new UserInputError('Person not found', {
					invalidArgs: args,
				});
			}

			const nonFriendsAlready = currentUser.friends.filter(
				(friend) => friend.name !== person.name
			);

			if (!nonFriendsAlready) {
				currentUser.friends = [...currentUser.friends, person];

				try {
					await currentUser.save();
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args,
					});
				}
			}

			return currentUser;
		},
	},
};

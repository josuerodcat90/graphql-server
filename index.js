import { gql } from 'apollo-server';
import { ApolloServer, UserInputError } from 'apollo-server';
import { v4 } from 'uuid';
import axios from 'axios';

const typeDefs = gql`
	enum YesNo {
		YES
		NO
	}

	type Address {
		street: String!
		city: String!
	}

	type Person {
		id: ID!
		name: String!
		age: Int!
		phone: String
		street: String!
		address: Address!
		canDrink: String!
		check: String!
		city: String
	}

	type Query {
		personCount: Int!
		allPersons(hasPhone: YesNo): [Person]!
		findPerson(name: String!): Person
	}

	type Mutation {
		addPerson(
			name: String!
			age: Int!
			phone: String
			street: String!
			city: String!
		): Person!

		editNumber(name: String!, phone: String!): Person!
	}
`;

const resolvers = {
	Query: {
		personCount: async () => {
			const { data: persons } = await axios.get(
				'http://localhost:3000/persons'
			);

			return persons.length;
		},
		allPersons: async (root, args) => {
			const { data: persons } = await axios.get(
				'http://localhost:3000/persons'
			);

			const { hasPhone } = args;

			if (!hasPhone) return persons;

			const byPhone = (person) =>
				hasPhone === 'YES' ? person.phone : !person.phone;

			return persons.filter(byPhone);
		},
		findPerson: async (root, args) => {
			const { name } = args;

			const person = await axios
				.get(`http://localhost:3000/persons?name=${name}`)
				.then((res) => res.data[0])
				.catch((err) => {
					throw new UserInputError(err.message, {
						invalidArgs: args,
					});
				});

			return person;
		},
	},
	Person: {
		canDrink: (person) => {
			return person.age >= 18 ? 'YES' : 'NOPE';
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
		addPerson: async (root, args) => {
			const { name, age, phone, street, city } = args;

			const person = await axios
				.get(`http://localhost:3000/persons?name=${name}`)
				.then((res) => res.data[0])
				.catch((err) => {
					throw new UserInputError(err.message, {
						invalidArgs: args,
					});
				});

			if (person) {
				throw new UserInputError('The user already exist!', {
					invalidArgs: name,
				});
			}

			const newPerson = {
				id: v4(),
				name,
				age,
				phone,
				street,
				city,
			};

			await axios.post('http://localhost:3000/persons', newPerson);

			return newPerson;
		},
		editNumber: async (root, args) => {
			const { name, phone } = args;
			const { data: persons } = await axios.get(
				'http://localhost:3000/persons'
			);

			const person = persons.find((person) => person.name === name);

			if (!person) {
				throw new UserInputError('Person not found', {
					invalidArgs: name,
				});
			}

			const updatedPerson = { ...person, phone };

			await axios.put(`http://localhost:3000/persons/${person.id}/`, {
				...person,
				phone,
			});
			// persons[personIndex] = updatedPerson;

			return updatedPerson;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

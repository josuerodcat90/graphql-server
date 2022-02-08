import { gql } from 'apollo-server';
import { ApolloServer, UserInputError } from 'apollo-server';
import { v4 } from 'uuid';

const persons = [
	{
		id: '0298ad2d-b4a8-4f7b-a381-c96dd89da726',
		name: 'Loise Ivett',
		age: 30,
		phone: null,
		street: '5213 Vera Center',
		city: 'Jablonec nad Nisou',
	},
	{
		id: '14d34151-9a08-48fb-bff8-166f3d9d5dc6',
		name: 'Ines Colebeck',
		age: 8,
		phone: '(989) 9732428',
		street: '11578 Bowman Park',
		city: 'Loo',
	},
	{
		id: 'e667f437-11b8-4f6a-8a4a-ce9b302366c5',
		name: 'Derward Cullity',
		age: 19,
		phone: '(255) 1988827',
		street: '47 Mayer Avenue',
		city: 'Santa Maria',
	},
	{
		id: '2259f33a-bc31-40cc-8541-141680b852a9',
		name: 'Lonee Wythill',
		age: 16,
		phone: null,
		street: '2 Rusk Way',
		city: 'Malahide',
	},
	{
		id: 'f7fa72b0-969b-4d12-801f-226c2c1d697d',
		name: 'Flora Cato',
		age: 34,
		phone: '(324) 7002749',
		street: '979 Morrow Hill',
		city: 'Xinglongjie',
	},
];

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
		canDrink: Boolean!
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
	}
`;

const resolvers = {
	Query: {
		personCount: () => persons.length,
		allPersons: (root, args) => {
			if (!args.hasPhone) return persons;

			const byPhone = (person) =>
				args.hasPhone === 'YES' ? person.phone : !person.phone;

			return persons.filter(byPhone);
		},
		findPerson: (root, args) => {
			const { name } = args;
			return persons.find((person) => person.name === name);
		},
	},
	Person: {
		canDrink: (person) => person.age >= 18,
		address: (person) => {
			return {
				street: person.street,
				city: person.city,
			};
		},
		check: () => 'LOL',
	},
	Mutation: {
		addPerson: (root, args) => {
			const { name, age, phone, street, city } = args;

			if (persons.find((person) => person.name === name)) {
				throw new UserInputError('Name must be unique', {
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

			persons.push(newPerson);

			return newPerson;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

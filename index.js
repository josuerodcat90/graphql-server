import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server';

const persons = [
	{
		id: '0298ad2d-b4a8-4f7b-a381-c96dd89da726',
		name: 'Loise Ivett',
		age: 30,
		phone: '(379) 2114899',
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
		phone: '(958) 2463417',
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
		allPersons: [Person]!
		findPerson(name: String!): Person
	}
`;

const resolvers = {
	Query: {
		personCount: () => persons.length,
		allPersons: () => persons,
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
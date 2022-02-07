import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server';

const persons = [
	{
		id: '1581f3a4-0ec7-47e0-8052-d9ed18005982',
		name: 'Aggy Vorley',
		phone: '(942) 9368533',
		street: '070 Judy Place',
		city: 'Klaeng',
	},
	{
		id: '98ab524a-aa98-41d0-9ae8-1d2b85fdfd47',
		name: 'Roze Abbes',
		phone: '(660) 4216744',
		street: '3283 Bashford Avenue',
		city: 'Haikou',
	},
	{
		id: '86952a0e-f624-409f-a743-06cae8bcbe15',
		name: 'Clara Indgs',
		phone: '(136) 3450159',
		street: '7 Blackbird Alley',
		city: 'Salogon',
	},
	{
		id: '64f7da91-06e3-47fe-b76d-9b5841ebfdcc',
		name: 'Gracia Heeron',
		phone: '(348) 1614158',
		street: '4032 Farmco Drive',
		city: 'Sudogda',
	},
	{
		id: '9c45b671-e834-4451-bbf4-ab710d7e49e8',
		name: "Tadeo O' Mullane",
		phone: '(934) 4713840',
		street: '4 Barby Crossing',
		city: 'Lubichowo',
	},
];

const typeDefs = gql`
	type Person {
		id: ID!
		name: String!
		phone: String
		street: String!
		city: String
	}

	type Query {
		personCount: Int!
		allPersons: [Person]!
	}
`;

const resolvers = {
	Query: {
		personCount: () => persons.length,
		allPersons: () => persons,
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

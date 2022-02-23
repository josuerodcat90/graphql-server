import { gql } from 'apollo-server';

export const typeDefs = gql`
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

	type User {
		id: ID!
		username: String!
		password: String!
		email: String!
		friends: [Person]!
	}

	type Token {
		value: String!
	}

	type Query {
		personCount: Int!
		allPersons(hasPhone: YesNo): [Person]!
		findPerson(name: String!): Person
		me: User
	}

	type Mutation {
		addPerson(
			name: String!
			age: Int!
			phone: String
			street: String!
			city: String!
		): Person!
		deletePerson(id: ID!): String!
		editNumber(name: String!, phone: String!): Person!
		createUser(username: String, password: String!, email: String!): User!
		login(email: String!, password: String!): Token!
		addAsFriend(name: String!): User!
	}
`;

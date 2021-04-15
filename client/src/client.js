import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

// this is the schema definition language
const typeDefs = gql`
  extend type User {
    age: Int
  }
`;

const resolvers = {
  User: {
    age() {
      return 30;
    },
  },
};

const link = new HttpLink({ uri: "http://localhost:4000/" });
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link,
  resolvers,
  typeDefs,
});

export default client;

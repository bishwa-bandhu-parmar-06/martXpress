import { authResolver } from "./auth.resolver.js";

export const resolvers = {
  Query: {
    health: () => "GraphQL is working 🚀",
  },
  Mutation: {
    ...authResolver.Mutation,
  },
};

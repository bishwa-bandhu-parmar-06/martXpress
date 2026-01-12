export const typeDefs = `#graphql

  # 🔹 Common response structure
  type AuthResponse {
    status: Int
    message: String
    token: String
    role: String
  }

  # 🔹 GET type queries
  type Query {
    health: String
  }

  # 🔹 POST / actions
  type Mutation {
    login(email: String!): AuthResponse
    verifyOtp(email: String!, otp: String!): AuthResponse
    registerUser(email: String!): AuthResponse
    resendOtp(email: String!): AuthResponse
  }
`;

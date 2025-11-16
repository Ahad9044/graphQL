import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors());

app.get("/", (req, res) => {
  res.send("CORS enabled!");
});
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }
    type Todo {
    id : Int
    title : String
    completed: Boolean
    user : User
    }

    type User {
    id: Int
    name: String
    username: String
    email: String
    city: String
    zipcode: String
    }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getBooks: [Book]
    getTodos: [Todo]
    getUser : [User]
    getData(id: Int!): User
  }
    `
  ;
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Todo: {
    user: async (todo) => {
      // console.log(todo);
      
     const user = (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
     return user
    }
  },
  Query: {
    getBooks: () => books,
    getTodos: async () =>{const res= (await axios.get("https://jsonplaceholder.typicode.com/todos")).data
      // console.log(res)
      return res;
      
    },
    getUser: async () => (await axios.get(`https://jsonplaceholder.typicode.com/users`)).data,
    getData: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
  },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({}),
  csrfPrevention: false,   // << disable CSRF check
  cors: {
    origin: "*",
    credentials: true
  }
});


console.log(`🚀  Server ready at: ${url}`);
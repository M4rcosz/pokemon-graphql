import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import fetch from 'node-fetch';

// Definição do schema GraphQL
const typeDefs = gql`
  type Pokemon {
    name: String
  }

  type Query {
    pokemons: [Pokemon]
  }
`;

// Resolver para buscar dados da PokéAPI
const resolvers = {
  Query: {
    pokemons: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
      const data = await response.json();
      return data.results;
    },
  },
};

// Função principal para inicializar o servidor
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // Aguarda a inicialização do servidor

  const app = express();
  server.applyMiddleware({ app });

  // Inicialização do servidor
  app.listen({ port: 4000 }, () =>
    console.log(`Servidor GraphQL rodando em http://localhost:4000${server.graphqlPath}`)
  );
}

// Chama a função para iniciar o servidor
startServer().catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});

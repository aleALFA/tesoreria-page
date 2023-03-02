import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphClient = new ApolloClient({
  uri: `${import.meta.env.VITE_API_BASE_PATH}/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
});

export default graphClient;
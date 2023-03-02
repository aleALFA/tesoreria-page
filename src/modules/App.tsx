// TODO: remover provider si no es necesario
// import { RepositoriesProvider } from './common/application/context/repositories';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider';

import graphClient from './common/infrastructure/repository/graph.repo';
import { AccessProvider } from './Auth/application/context/access';
import Router from '../config/router';
import './App.css';

function App() {
  return (
    <AccessProvider>
      <ApolloProvider client={graphClient}>
      {/* <RepositoriesProvider> */}
        <Router />
      {/* </RepositoriesProvider> */}
      </ApolloProvider>
    </AccessProvider>
  );
}

export default App

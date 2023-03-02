// import { createContext, useState } from "react";

// import AuthRepo from "../../../Auth/infrastructure/repository/auth.repo";
// import DashboardRepo from "../../../Dashboard/infrastructure/repository/dashboard.repo";

import useHttpDashboardRepo from "../../../Dashboard/infrastructure/repository/dashboardHttp.repo";
import useHttpAuthRepo from "../../../Auth/infrastructure/repository/authHttp.repo";
import useHttpBrotherRepo from "../../../Brother/infrastructure/repository/brotherHttp.repo";
import useGraphPaymentRepo from "../../../Payment/infrastructure/repository/paymentGraph.repo";

// interface Repositories {
//   authRepo?: AuthRepo,
//   dashboardRepo?: DashboardRepo,
// }
// interface RepositoriesContextService {
//   repositories: Repositories,
//   setRepositories: React.Dispatch<React.SetStateAction<Repositories>>,
// }

// const INIT_VALUE: RepositoriesContextService = {
//   repositories: {},
//   setRepositories: () => {},
// }

// const RepositoriesContext = createContext<RepositoriesContextService>(INIT_VALUE);

// function RepositoriesProvider({ children }: {children: React.ReactNode}) {
//   const [repositories, setRepositories] = useState(INIT_VALUE.repositories);

//   return (
//     <RepositoriesContext.Provider value={{ repositories, setRepositories }}>
//       {children}
//     </RepositoriesContext.Provider>
//   );
// };

const useAuthRepo = useHttpAuthRepo;
const useBrotherRepo = useHttpBrotherRepo;
const useDashboardRepo = useHttpDashboardRepo;
const usePaymentRepo = useGraphPaymentRepo;

export {
  // RepositoriesProvider,
  useAuthRepo,
  useBrotherRepo,
  useDashboardRepo,
  usePaymentRepo,
};
//import { persistStore } from 'redux-persist'

import configureStore from './store'
import history from './history'

const store = configureStore({});
//const persistor = persistStore(store)

export { store, history/*, persistor*/ }
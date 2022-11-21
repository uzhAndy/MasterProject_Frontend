import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import BackgroundImg from './shared/components/BackgroundImg';
import AppRouter from './shared/router/AppRouter';
import { AuthContextManagement } from './store/auth-context';
import { SocketContextManagement } from './store/socket-context';
import { URLContextManagement } from './store/url-context';



function App() {
  return (
    <>
      <BrowserRouter>
       <SocketContextManagement>
          <URLContextManagement>
              <AuthContextManagement>
              <Provider store={store}>
                <PersistGate loading={<BackgroundImg/>} persistor={persistor}>
                  <AppRouter />
                </PersistGate>
                </Provider>
              </AuthContextManagement>
          </URLContextManagement>
        </SocketContextManagement>
      </BrowserRouter>
    </>
  );
}

export default App;

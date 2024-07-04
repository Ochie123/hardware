import React, { lazy, Suspense } from 'react';
import { createGlobalStyle } from 'styled-components';
import { SnackbarProvider } from 'notistack';
import 'react-quill/dist/quill.snow.css';
import Helmet from 'react-helmet';
import { LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/view/Detail/scss/astro-ecommerce.scss"
import "../src/Layout/main-layout/Layout.scss"
import "../src/css/style.css"
import "../src/css/satoshi.css"
import MainLayout from '../src/Layout/main-layout/MainLayout';
//import ProtectedRoute from "./components/protected-route";
//import Homepage from "./view/Homepage";
const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Raleway', sans-serif;
  }
  body {
    margin: 2;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const LoginPage = lazy(() => import('./view/auth/LoginPage'));
const NotFoundPage = lazy(() => import('./view/pages/NotFoundPage'));
const ECommerce = lazy( () => import('../src/admin/Pagez'))
const DashboardDefaultContent = lazy(() => import('./view/products/LoggedIn/dashboard-default-content'));
const AuctionListView = lazy(() => import('../src/view/products/LoggedIn/AuctionListView'));
const AuctionCreateView = lazy(() => import('./view/products/LoggedIn/AuctionCreateView'));
const AccountView = lazy(() => import('./view/products/LoggedIn/accountView'));

function App() {
  const { claims } = useSelector(state => state.auth)

  return (
      <>
      <GlobalStyle />
      <SnackbarProvider dense maxSnack={3}>
      <Router>
        <Helmet titleTemplate="%s - Hardware" defaultTitle="Hardware">
          <meta name="description" content="Hardware" />
        </Helmet>
        <MainLayout>
          <Suspense fallback={<LinearProgress style={{ margin: '10rem' }} />}>
            <Routes>
            <Route path="/" element={<AuctionListView />} />            
              <Route path="login/" element={<LoginPage />} />
              <Route path="reports/" element={<ECommerce/>} />
              <Route path="create-product/" element={<AuctionCreateView />} />
              <Route path="account/" element={<AccountView />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </Router>
    </SnackbarProvider>
    </>
  );
}

export default App;
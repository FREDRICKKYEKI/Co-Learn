import './App.css';
import React, { useState, useEffect} from 'react'
import { SignUp } from './components/AuthComponents/SignUp';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import { LogIn } from './components/AuthComponents/LogIn';
// import { Profile } from './components/AuthComponents/Profile';
import { AuthProvider } from './components/Contexts/AuthProvider';
import { RequireAuth } from './components/AuthComponents/RequireAuth';
import { HomeScreen } from './components/HomeScreen';
import { NavBar } from './components/NavBar'
import { LearningSpace } from './components/LearningSpace';
import { LoadingScreen } from './components/LoadingScreen';
import { CreateLearningSpace } from './components/CreateLearningSpace';
import { DragDropFile } from './components/DragDropFile';
import { UserProfile } from './components/AuthComponents/UserProfile';
import { SideModal } from './components/SideModal';
import { Footer } from './components/Footer';

const LazyProfile = React.lazy(() => import('./components/AuthComponents/Profile')) 

function App() {
  const excludedRoutes = ['/login', '/signup']
  const location = useLocation();

  return (
    <>
      {!excludedRoutes.includes(location.pathname) && <NavBar />}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/user/:userid" element={<UserProfile/>} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <React.Suspense fallback={<LoadingScreen/>}>
                  <LazyProfile />
                </React.Suspense>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/learningspace/:spaceId" element={<LearningSpace />} />
          <Route path="/createlearningspace" element={<RequireAuth><CreateLearningSpace/></RequireAuth>} />
        </Routes>
      {!excludedRoutes.includes(location.pathname) && <Footer/>}
      </AuthProvider>
    </>
  );
}

export default App;

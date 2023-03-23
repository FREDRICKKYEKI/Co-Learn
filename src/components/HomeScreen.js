import React,{useEffect, useState} from 'react'
import { Card } from './Card'
import { useAuth } from './Contexts/AuthProvider'
import './styles/home.css'
import axios from 'axios'
import { LoadingScreen } from './LoadingScreen'
import { useFirebase } from './Hooks/useFirebase'
import { uuidv4 } from '@firebase/util'
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { database } from '../firebase'

export const HomeScreen = () => 
{
  const { currentUser } = useAuth();
  const title = currentUser
    ? "Join a learning space"
    : "Sign up to start learning";
  const change  = uuidv4();  
  const { state } = useFirebase(change);
  const data = state.spaces;

  return (
    <>
      {state.loading?<LoadingScreen/>:
        <div className="container">
          <div className="heading">
              <h1>
                {title}
              </h1>
          </div>
          <div className="co-learning-spaces">
          {data&&data.map((space,index)=>
            <Card key={space.id} spaceData={space} index={ index }/>
          )}
          </div>
        </div>
        }
      </>
  )
}
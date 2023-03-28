import { getDoc } from "firebase/firestore/lite"
import { useEffect, useReducer } from "react"
import { database, db, db2 } from "../../firebase"
import { useAuth } from "../Contexts/AuthProvider"
import { query, orderBy, where, onSnapshot } from "firebase/firestore";

const ACTIONS = 
{
    SET_SPACES: "set_spaces",
    SET_SPACE: "set_space",
    SET_LOADING: "set_loading",
    SET_USER: "set_user",
    SET_POSTS: "set_posts",
    SET_VOTES: "set_votes"
}
 
const initialState = 
{
    spaces:"",
    space:"",
    user:"",
    posts:"",
    votes:"",
    loading: true
}

const reducer = (state, {type, payload}) => 
{
    switch(type)
    {
        case ACTIONS.SET_LOADING:
            return{
                ...state,
                loading: payload.loading
            }
        case ACTIONS.SET_SPACES:
            return {
                ...state,
                spaces: payload.spaces
            }
        case ACTIONS.SET_SPACE:
            return {
                ...state,
                space: payload.space
            }
        case ACTIONS.SET_USER:
            return{
                ...state,
                user: payload.user
            }
        case ACTIONS.SET_POSTS:
            return{
                ...state,
                posts: payload.posts
            }
        case ACTIONS.SET_VOTES:
            return{
                ...state,
                votes: payload.votes
            }
        default: return state;
    }
}

export const useFirebase = (spaceId = null, uid = null, postId = null) => 
{
    const [state, dispatch] = useReducer(reducer, initialState);
    const spacesRef = database.learningSpaces;
    const postsRef = database.posts;
    const usersRef = database.users;
    const votesRef = database.votes;
    
    useEffect(() => 
    {
        if(postId == null) return;
        const q = query(votesRef, where("postId","==",postId));
        
        return onSnapshot(q, (querySnap) =>
        {
                const data = querySnap.docs.map(doc => database.formatDoc(doc));
                dispatch({type: ACTIONS.SET_VOTES, payload: {votes: data}});
                dispatch({type: ACTIONS.SET_LOADING, payload: {loading: false}});
        },(e)=> 
        {
            console.log(e);
            dispatch({type: ACTIONS.SET_LOADING, payload: {loading: false}})
        })
    }, [])
    

    useEffect(() =>
    {
        if(spaceId == null) return;
            const q = query(postsRef, where("spaceId","==",spaceId,), orderBy("timestamp","desc"));
            
        return onSnapshot(q, (querySnap) => 
        {
            const data = querySnap.docs.map(doc => database.formatDoc(doc));
            dispatch({type: ACTIONS.SET_POSTS, payload: {posts: data}});
            dispatch({type:ACTIONS.SET_LOADING, payload: {loading: false}});

        },() => dispatch({type:ACTIONS.SET_LOADING, payload: {loading: false}}))

        },[])


    useEffect(() =>
    {
        if(uid == null) return;
        const usersDocRef = database.user(uid);

        return onSnapshot(usersRef, () =>
        {
            getDoc(usersDocRef)
            .then((docSnap) =>
            {
                if(docSnap.exists())
                {
                    dispatch({type: ACTIONS.SET_USER, payload: {user: docSnap.data()}});
                    dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}});
                    
                }
            }).catch(() => dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}}));
        });    
    }, [])
    

    useEffect(() =>
    {
        return onSnapshot(spacesRef, (querySnap) => 
        {
            const data = querySnap.docs.map(doc => database.formatDoc(doc));
      
            dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}});
            dispatch({type: ACTIONS.SET_SPACES, payload: {spaces: data}});
            
        },
        () => dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}}))
    },[])

    useEffect(() =>
    {
        if(spaceId == null) return;
        const spacesDocRef = database.learningSpace(spaceId)

        return onSnapshot(spacesRef,() =>
        {
            getDoc(spacesDocRef)
            .then((docSnap) =>
            {
                if(docSnap.exists())
                {
                    dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}})
                    dispatch({type: ACTIONS.SET_SPACE, payload:{space: docSnap.data()}})
                    
                }
            }).catch(() => dispatch({type: ACTIONS.SET_LOADING, payload:{loading: false}}))
        })
    }, [spaceId])
    
    return {state, dispatch}
}
import {useDispatch } from 'react-redux'
import { register,login, logout, getCurrentUser } from '../api/authApi';
import { setLoading, setUser } from '../../../redux/auth.slice';
import { setResume } from '../../../redux/resume.slice';
export const useAuth=() => {
    const dispatch=useDispatch();
    const registerUser=async ({username,email,password,role}) => {
        try{
            dispatch(setLoading(true))
            const res=await register({username,email,password,role});
            // Session hydration is handled by getMe and server-side cookies, so do not persist client-side auth state here.
            dispatch(setResume({ message: "No resume found", resume: null }));
            dispatch(setUser(res.user));
            
        }catch(err){
            console.log("🚀 ~ useAuth ~ err:", err);
        }
        finally{
          dispatch(setLoading(false))
        }
    };
    const loginUser=async ({email,password}) => {
      try{
        dispatch(setLoading(true));
        const res=await login({email,password});
        // Session hydration will be updated from the backend via getMe; do not persist tokens/client user data in localStorage.
        dispatch(setResume({ message: "No resume found", resume: null }));
        dispatch(setUser(res.user));
        return res; 
      }
      catch(err){
        console.log("🚀 ~ useAuth ~ err:", err)
      }
      finally{
        dispatch(setLoading(false))
      }
    }
    const logoutUser=async () => {
      try{
        dispatch(setLoading(true));
        await logout();
        dispatch(setUser(null));
        dispatch(setResume({ message: "No resume found", resume: null }));
      }
      catch(err){
        console.log("🚀 ~ useAuth ~ err:", err)
      }
      finally{
        dispatch(setLoading(false))
      }
    }
    const getMe=async () => {
      try{
        dispatch(setLoading(true));
        const res=await getCurrentUser();
          dispatch(setUser(res.user));
            
        }catch(err){
            console.log("🚀 ~ useAuth ~ err:", err);
        }
        finally{
          dispatch(setLoading(false))
        }}
    return{registerUser,loginUser,logoutUser,getMe}
};
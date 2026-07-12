import {useDispatch } from 'react-redux'
import { register,login, logout } from '../api/authApi';
import { setLoading, setUser } from '../../../redux/auth.slice';
export const useAuth=() => {
    const dispatch=useDispatch();
    const registerUser=async ({username,email,password,role}) => {
        try{
            dispatch(setLoading(true))
            const res=await register({username,email,password,role});
            if(res){
                localStorage.setItem("user",JSON.stringify(res.user));
                 localStorage.setItem("token", res.token);
            }
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
        if(res){
          localStorage.setItem("user",JSON.stringify(res.user));
           localStorage.setItem("token", res.token);
        }
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
        localStorage.removeItem("user");
        dispatch(setUser(null));
      }
      catch(err){
        console.log("🚀 ~ useAuth ~ err:", err)
      }
      finally{
        dispatch(setLoading(false))
      }
    }
    return{registerUser,loginUser,logoutUser}
};
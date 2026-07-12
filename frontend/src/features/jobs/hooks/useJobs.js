import { useDispatch } from "react-redux";
import { getAllJobApi } from "../api/job.api";
import { setJob, setLoading } from "../../../redux/job.slice";
export const useJobs=()=>{
    const dispatch=useDispatch();
    const getAllJobs=async()=>{
      try{
        dispatch(setLoading(true));
        const res=await getAllJobApi();
        dispatch(setJob(res.jobs));
      }catch(err){
        dispatch(setError(err));
      }finally{
        dispatch(setLoading(false));
      }
    }
    return {getAllJobs};
}
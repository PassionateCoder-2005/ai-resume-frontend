import { useDispatch } from "react-redux";
import { getAllJobApi, getJobByIdApi } from "../api/job.api";
import { setJob, setLoading, setSingleJob,setError } from "../../../redux/job.slice";
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
    const getOneJob=async (id) => {
      try {
        dispatch(setLoading(true))
        const res=await getJobByIdApi(id)
        console.log(res)
        dispatch(setSingleJob(res.job))
      } catch (error) {
        dispatch(setError(error))
      }finally{
        dispatch(setLoading(false))
      }
    }
    return {getAllJobs,getOneJob};
}
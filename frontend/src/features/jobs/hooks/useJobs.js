import { useDispatch } from "react-redux";
import { getAllJobApi, getJobByIdApi, applyJobApi, getApplicationsApi, getAiRecommendedJobApi } from "../api/job.api";
import { setJob, setLoading, setSingleJob,setError, setApplication, setAiRecommendJobs } from "../../../redux/job.slice";
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
    const applyJob=async(id)=>{
      try{
        dispatch(setLoading(true))
        const res=await applyJobApi(id)
        if (res.job) {
          dispatch(setSingleJob(res.job))
        }
        return res;
      }catch(error){
        dispatch(setError(error))
        throw error;
      }finally{
        dispatch(setLoading(false))
      }
    }
    const getApplications=async () => {
      try{
        dispatch(setLoading(true))
        const res=await getApplicationsApi()
        console.log(res)
        dispatch(setApplication(res.applications))
      }catch(error){
        dispatch(setError(error))
      }finally{
        dispatch(setLoading(false))
      }
    }
    const getAiRecommendedJobs=async () => {
      try{
        dispatch(setLoading(true))
        const res=await getAiRecommendedJobApi()
        console.log(res)
        dispatch(setAiRecommendJobs(res))
      }catch(error){
        dispatch(setError(error))
      }finally{
        dispatch(setLoading(false))
      }
    }
    return {getAllJobs,getOneJob,applyJob,getApplications,getAiRecommendedJobs};
}
import axios from "axios"
const axiosInstance=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/job",
    withCredentials:true
});
const axiosInstance2=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/application",
    withCredentials:true
});
export const getAllJobApi=async () => {
    const res=await axiosInstance.get("/all-jobs")
    return res.data;
}
export const getJobByIdApi=async (id) => {
    const res=await axiosInstance.get(`/${id}/job/details`)
    return res.data;
}
export const applyJobApi=async (id) => {
    const res=await axiosInstance2.post("/apply", { job: id })
    return res.data;
}
export const getApplicationsApi=async () => {
    const res=await axiosInstance2.get("/all")
    return res.data;
}
export const getAiRecommendedJobApi=async () => {
    const res=await axiosInstance.get("/suggested/recommendations")
    return res.data;
} 

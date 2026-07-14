import axios from "axios"
const axiosInstance=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/job",
    withCredentials:true
});
const axiosInstance2=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/application",
    withCredentials:true
});
const axiosInstance3=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/ai",
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
export const getAllJobsCredatedByHr=async () => {
    const res=await axiosInstance.get("/all-jobs/hr")
    return res.data;
}
export const deleteJobById=async (id) => {
    const res=await axiosInstance.delete(`/${id}/delete`)
    return res.data;
}
export const createJob=async (job) => {
    const res=await axiosInstance.post("/create", job)
    return res.data;
}   
export const getOneJobAllDetailsForHr=async (id) => {
    const res=await axiosInstance.get(`/${id}/applicants`)
    return res.data
}
export const updateApplicationStatus=async (id,status) => {
    const res=await axiosInstance2.patch(`/${id}`,status)
    return res.data
}
export const aiMatch=async (applicationId)=>{
    const res=await axiosInstance3.post(`/applications/${applicationId}/match`)
    return res.data
}
export const interviewQuestions=async(applicationId)=>{
    const res=await axiosInstance3.post(`/applications/${applicationId}/interview-questions`)
    return res.data
}
export const getAllApplicationofHr=async()=>{
    const res=await axiosInstance2.get("/hr/all")
    return res.data
}
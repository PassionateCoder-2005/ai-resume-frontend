import axios from "axios"
const axiosInstance=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/job",
    withCredentials:true
});
export const getAllJobApi=async () => {
    const res=await axiosInstance.get("/all-jobs")
    return res.data;
}
export const getJobByIdApi=async (id) => {
    const res=await axiosInstance.get(`/${id}/job/details`)
    return res.data;``
}
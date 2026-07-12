import axios from "axios";
const axiosInstance=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api/upload",
    withCredentials:true
});
export const uploadResumeApi=async (formData) => {
    const res=await axiosInstance.post("/resume",formData,{headers:{"Content-Type":"multipart/form-data"}})
    return res.data;
}
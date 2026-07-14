import axios from "axios"
const axiosInstance=axios.create({
    baseURL:"https://ai-resume-kwab.onrender.com/api",
    withCredentials:true
});

export const register=async ({username,email,password,role}) => {
    const res=await axiosInstance.post("/auth/register",{username,email,password,role});
    return res.data;
};

export const login=async({email,password}) => {
    const res=await axiosInstance.post("/auth/login",{email,password});
    return res.data;
};

export const logout=async() => {
    const res=await axiosInstance.post("/auth/logout");
    return res.data;
};
export const getCurrentUser=async() => {
    const res=await axiosInstance.get("/auth/getme");
    return res.data;
}
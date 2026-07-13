import { useDispatch } from "react-redux";
import { uploadResumeApi } from "../api/resume.api";
import { setError, setLoading, setResume } from "../../../redux/resume.slice";

export const useResumes = () => {
    const dispatch = useDispatch();
    const uploadResume = async (formData) => {
        try {
            dispatch(setLoading(true));
            const res = await uploadResumeApi(formData);
            console.log(res.resume)
            dispatch(setResume(res));
        } catch (error) {
            dispatch(setError(error));
        }
        finally {
            dispatch(setLoading(false));
        }
    }
    return {
        uploadResume
    }

}
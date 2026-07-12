import { useDispatch } from "react-redux";
import { uploadResumeApi } from "../api/resume.api";
import { setResume, setLoading, setError } from "../redux/resume.slice";

export const useResumes = () => {
    const dispatch = useDispatch();
    const uploadResume = async (formData) => {
        try {
            dispatch(setLoading(true));
            const res = await uploadResumeApi(formData);
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
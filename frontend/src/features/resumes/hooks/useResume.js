import { useDispatch } from "react-redux";
import { getMyResume, uploadResumeApi } from "../api/resume.api";
import { setError, setLoading, setResume } from "../../../redux/resume.slice";

export const useResumes = () => {
    const dispatch = useDispatch();
    const uploadResume = async (formData) => {
        try {
            dispatch(setLoading(true));
            const res = await uploadResumeApi(formData);
            const payload = res?.resume !== undefined ? res : {
                message: res?.message || "Resume uploaded successfully",
                resume: res || null,
            };
            dispatch(setResume(payload));
            return res;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        }
        finally {
            dispatch(setLoading(false));
        }
    }
    const getResume = async () => {
        try {
            dispatch(setLoading(true));
            const res = await getMyResume();
            const payload = res?.resume !== undefined ? res : {
                message: res?.message || "No resume found",
                resume: res || null,
            };
            dispatch(setResume(payload));
            return res;
        } catch (error) {
            dispatch(setError(error));
            dispatch(setResume({ message: "No resume found", resume: null }));
            return null;
        }
        finally{
            dispatch(setLoading(false));
        }
    }
    return {
        uploadResume,getResume
    }

}
import { useDispatch } from "react-redux";
import {
  getAllJobApi, getJobByIdApi, applyJobApi, getApplicationsApi,
  getAiRecommendedJobApi, getAllJobsCredatedByHr, deleteJobById,
  createJob, getOneJobAllDetailsForHr, updateApplicationStatus,
  aiMatch, interviewQuestions, getAllApplicationofHr
} from "../api/job.api";
import {
  setJob, setLoading, setSingleJob, setError,
  setApplication, setAiRecommendJobs, setHrJobs, setHrJobApplicants
} from "../../../redux/job.slice";

export const useJobs = () => {
  const dispatch = useDispatch();

  const getAllJobs = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAllJobApi();
      dispatch(setJob(res.jobs));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getOneJob = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await getJobByIdApi(id);
      dispatch(setSingleJob(res.job));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const applyJob = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await applyJobApi(id);
      if (res.job) dispatch(setSingleJob(res.job));
      return res;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getApplications = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getApplicationsApi();
      dispatch(setApplication(res.applications));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getAiRecommendedJobs = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAiRecommendedJobApi();
      dispatch(setAiRecommendJobs(res));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── HR Actions ──────────────────────────────────────────────────────

  const getHrJobs = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAllJobsCredatedByHr();
      dispatch(setHrJobs(res.jobs || []));
      return res;
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteHrJob = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await deleteJobById(id);
      return res;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createHrJob = async (jobData) => {
    try {
      dispatch(setLoading(true));
      const res = await createJob(jobData);
      return res;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getHrJobApplicants = async (jobId) => {
    try {
      dispatch(setLoading(true));
      const res = await getOneJobAllDetailsForHr(jobId);
      dispatch(setHrJobApplicants(res));
      return res;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateStatus = async (applicationId, statusPayload) => {
    try {
      const res = await updateApplicationStatus(applicationId, statusPayload);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const runAiMatch = async (applicationId) => {
    try {
      const res = await aiMatch(applicationId);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const getInterviewQuestions = async (applicationId) => {
    try {
      const res = await interviewQuestions(applicationId);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const getHrApplications = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getAllApplicationofHr();
      dispatch(setApplication(res.applications || []));
      return res;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    getAllJobs, getOneJob, applyJob, getApplications, getAiRecommendedJobs,
    // HR
    getHrJobs, deleteHrJob, createHrJob, getHrJobApplicants,
    updateStatus, runAiMatch, getInterviewQuestions, getHrApplications,
  };
};
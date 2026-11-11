import api from "./api";

export const getApplications = () => {
    return api.get("/applications");
};

export const createApplication = (application) => {
    return api.post("/applications", application);
};

export const updateApplication = (id, application) => {
    return api.put(`/applications/${id}`, application);
};

export const deleteApplication = (id) => {
    return api.delete(`/applications/${id}`);
};

export const searchApplications = (companyName) => {
    return api.get("/applications/search", { params: { companyName } });
};

export const getApplicationById = (id) => api.get(`/applications/${id}`);
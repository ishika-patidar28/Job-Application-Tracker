import { useState } from "react";
import { createApplication } from "../services/jobApplicationService";

function ApplicationForm() {

    const [application, setApplication] = useState({
        companyName: "",
        jobTitle: "",
        location: "",
        salary: "",
        applicationDate: "",
        status: "APPLIED",
        jobUrl: "",
        notes: ""
    });

    const handleChange = (e) => {
        setApplication({
            ...application,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createApplication(application);

            alert("Application added successfully!");

            setApplication({
                companyName: "",
                jobTitle: "",
                location: "",
                salary: "",
                applicationDate: "",
                status: "APPLIED",
                jobUrl: "",
                notes: ""
            });

            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Failed to add application");
        }
    };

    return (
        <div className="form-card">

            <h2>Add Job Application</h2>

            <form onSubmit={handleSubmit}>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="e.g. TCS"
                            value={application.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            placeholder="e.g. Java Developer"
                            value={application.jobTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g. Indore"
                            value={application.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Salary</label>
                        <input
                            type="number"
                            name="salary"
                            placeholder="e.g. 700000"
                            value={application.salary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Application Date</label>
                        <input
                            type="date"
                            name="applicationDate"
                            value={application.applicationDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={application.status}
                            onChange={handleChange}
                        >
                            <option value="APPLIED">Applied</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="SELECTED">Selected</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Job URL</label>
                        <input
                            type="url"
                            name="jobUrl"
                            placeholder="https://company.com/job"
                            value={application.jobUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            placeholder="Add notes about this application..."
                            value={application.notes}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <button className="add-button" type="submit">
                    + Add Application
                </button>

            </form>
        </div>
    );
}

export default ApplicationForm;


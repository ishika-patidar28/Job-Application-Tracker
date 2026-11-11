import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById } from "../services/jobApplicationService";

function ApplicationDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loadApplication = async () => {
            try {
                const response = await getApplicationById(id);
                setApplication(response.data);
            } catch (error) {
                console.error("Error loading application:", error);
                setLoadError(true);
            }
        };

        loadApplication();
    }, [id]);

    if (loadError) {
        return (
            <main className="container">
                <button className="detail-back-button" onClick={() => navigate("/")}>
                    ← Back to Dashboard
                </button>
                <div className="empty-state" role="alert">
                    <strong>Could not load this application</strong>
                    <p>Please return to the dashboard and try again.</p>
                </div>
            </main>
        );
    }

    if (!application) {
        return <main className="container"><div className="empty-state" role="status">Loading application...</div></main>;
    }

    return (
        <div className="container">
            <button className="detail-back-button" onClick={() => navigate("/")}>
                ← Back to Dashboard
            </button>

            <div className="application-card detail-card">
                <h2>{application.companyName}</h2>

                <p>
                    <strong>Job Title:</strong>{" "}
                    {application.jobTitle}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {application.location}
                </p>

                <p>
                    <strong>Salary:</strong>{" "}
                    ₹{application.salary}
                </p>

                <p>
                    <strong>Application Date:</strong>{" "}
                    {application.applicationDate}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    <span className="status">
                        {(application.status || "unknown").toLowerCase().replaceAll("_", " ")}
                    </span>
                </p>

                <p>
                    <strong>Job URL:</strong>{" "}
                    {application.jobUrl
                        ? <a href={application.jobUrl} target="_blank" rel="noreferrer">View job posting</a>
                        : "Not provided"}
                </p>

                <p>
                    <strong>Notes:</strong>{" "}
                    {application.notes}
                </p>

            </div>

        </div>
    );
}

export default ApplicationDetails;
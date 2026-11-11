import { useEffect, useState } from "react";
import { getApplications } from "../services/jobApplicationService";
import { Link } from "react-router-dom";

function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const response = await getApplications();
                setApplications(response.data);
            } catch (error) {
                console.error("Error loading applications:", error);
                setLoadError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadApplications();
    }, []);

    const filteredApplications = applications.filter((application) => {
        const search = searchText.toLowerCase().trim();

        return (
            (application.companyName || "").toLowerCase().includes(search) ||
            (application.jobTitle || "").toLowerCase().includes(search) ||
            (application.location || "").toLowerCase().includes(search)
        );
    });

    return (
        <div className="application-section">
            <h2>My Job Applications</h2>

            <input
                type="text"
                className="search-input"
                aria-label="Search applications"
                placeholder="Search by company, job title or location..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            {isLoading ? (
                <div className="empty-state" role="status">Loading your applications...</div>
            ) : loadError ? (
                <div className="empty-state" role="alert">
                    <strong>Could not load applications</strong>
                    <p>Please refresh the page and try again.</p>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="empty-state">
                    <strong>
                        {applications.length === 0
                            ? "No applications yet"
                            : "No matching applications"}
                    </strong>
                    <p>
                        {applications.length === 0
                            ? "Add your first job application using the form above."
                            : "Try searching with a different company, role, or location."}
                    </p>
                </div>
            ) : (
                <div className="application-grid">
                    {filteredApplications.map((application) => (
                        <Link
                            className="application-card"
                            key={application.id}
                            to={`/application/${application.id}`}
                        >
                            <h3>{application.companyName}</h3>
                            <p><strong>Job:</strong> {application.jobTitle}</p>
                            <p><strong>Location:</strong> {application.location || "Not specified"}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className="status">
                                    {(application.status || "unknown").toLowerCase().replaceAll("_", " ")}
                                </span>
                            </p>
                            <p><strong>Date:</strong> {application.applicationDate || "Not specified"}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ApplicationList;
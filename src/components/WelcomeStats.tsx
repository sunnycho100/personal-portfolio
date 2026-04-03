

const WelcomeStats = () => {
    return (
        <div className="welcome-section">
            <div className="stats-header">
                <h1>Thank you for visiting!</h1>

                <div className="summary-numbers">
                    <div className="sum-item">
                        <div className="sum-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                        </div>
                        <div className="sum-text">
                            <span className="sum-val">78</span>
                            <span className="sum-label">Employees</span>
                        </div>
                    </div>
                    <div className="sum-item">
                        <div className="sum-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        </div>
                        <div className="sum-text">
                            <span className="sum-val">56</span>
                            <span className="sum-label">Hires</span>
                        </div>
                    </div>
                    <div className="sum-item">
                        <div className="sum-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </div>
                        <div className="sum-text">
                            <span className="sum-val">203</span>
                            <span className="sum-label">Projects</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeStats;

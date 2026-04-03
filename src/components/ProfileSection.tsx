

const ProfileSection = () => {
    return (
        <div className="col-left">
            <div className="profile-card">
                <div className="profile-img">
                    <img src="/profile.png" alt="Lora Peterson" />
                    <div className="salary-tag">$1,200</div>
                    <div className="profile-info">
                        <h3>Lora Peterson</h3>
                        <p>UX/UI Designer</p>
                    </div>
                </div>
            </div>

            <div className="accordion-list">
                <div className="acc-item">
                    <div className="acc-header">
                        <span>Pension contributions</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                </div>
                <div className="acc-item expanded">
                    <div className="acc-header">
                        <span>Devices</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
                    </div>
                    <div className="acc-body">
                        <div className="device-item">
                            <div className="device-icon">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="12" rx="2"></rect><path d="M0 18h24v2H0z"></path></svg>
                            </div>
                            <div className="device-info">
                                <h4>MacBook Air</h4>
                                <p>Version M1</p>
                            </div>
                            <button className="more-options">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="acc-item">
                    <div className="acc-header">
                        <span>Compensation Summary</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                </div>
                <div className="acc-item">
                    <div className="acc-header">
                        <span>Employee Benefits</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;

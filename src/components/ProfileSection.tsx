const ProfileSection = () => {
    return (
        <div className="profile-card">
            <div className="profile-img">
                <img src="/profile-image.jpg" alt="Profile" />
                <a href="https://www.linkedin.com/in/chosunghwan/" target="_blank" rel="noopener noreferrer" className="salary-tag connect-btn" aria-label="Connect on LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </a>
                <div className="profile-info">
                    <h3>Sunny Cho</h3>
                    <p>Software Engineer</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;

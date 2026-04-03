

const TimeTracker = () => {
    return (
        <div className="card time-tracker">
            <div className="card-top">
                <h3>Time tracker</h3>
                <button className="icon-link"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10"></path></svg></button>
            </div>
            <div className="timer-circle-wrap">
                <svg className="progress-ring" width="130" height="130">
                    <circle stroke="#f0f0f0" strokeWidth="6" fill="transparent" r="58" cx="65" cy="65"/>
                    <circle className="ring-fill" stroke="#ffd643" strokeWidth="12" strokeLinecap="round" fill="transparent" r="58" cx="65" cy="65"/>
                </svg>
                <div className="timer-text">
                    <span className="time">02:35</span>
                    <span className="label">Work Time</span>
                </div>
            </div>
            <div className="tracker-controls">
                <button className="ctrl-btn play-btn"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"></path></svg></button>
                <button className="ctrl-btn pause-btn"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></button>
                <button className="ctrl-btn dark-btn stop-btn"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6" fill="#fff"></rect></svg></button>
            </div>
        </div>
    );
};

export default TimeTracker;

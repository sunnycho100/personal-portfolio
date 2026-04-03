

const TaskList = () => {
    return (
        <div className="card dark-dashboard task-panel">
            <div className="card-top">
                <h3>Onboarding Task</h3>
                <div className="fraction">2/8</div>
            </div>
            <div className="task-list">
                <div className="task-row done">
                    <div className="task-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M8 21h8"></path><path d="M12 18v3"></path></svg></div>
                    <div className="task-info">
                        <h4>Interview</h4>
                        <span>Sep 13, 08:30</span>
                    </div>
                    <div className="chk yellow-chk"><svg width="12" height="12" fill="none" stroke="#222" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg></div>
                </div>
                <div className="task-row done">
                    <div className="task-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg></div>
                    <div className="task-info">
                        <h4>Team Meeting</h4>
                        <span>Sep 13, 10:30</span>
                    </div>
                    <div className="chk yellow-chk"><svg width="12" height="12" fill="none" stroke="#222" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg></div>
                </div>
                <div className="task-row">
                    <div className="task-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>
                    <div className="task-info">
                        <h4>Project Update</h4>
                        <span>Sep 13, 13:00</span>
                    </div>
                    <div className="chk empty-chk"></div>
                </div>
                <div className="task-row">
                    <div className="task-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2A10 10 0 1022 12 10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"></path><path d="M12 6v6l4 2"></path></svg></div>
                    <div className="task-info">
                        <h4>Discuss Q3 Goals</h4>
                        <span>Sep 13, 14:45</span>
                    </div>
                    <div className="chk empty-chk"></div>
                </div>
                <div className="task-row">
                    <div className="task-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg></div>
                    <div className="task-info">
                        <h4>HR Policy Review</h4>
                        <span>Sep 13, 16:30</span>
                    </div>
                    <div className="chk empty-chk"></div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;

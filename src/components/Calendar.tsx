

const Calendar = () => {
    return (
        <div className="card calendar-card">
            <div className="calendar-header">
                <span className="month-side">August</span>
                <span className="month-main">September 2024</span>
                <span className="month-side">October</span>
            </div>
            <div className="calendar-days">
                <div className="day-col">Mon<br/>22</div>
                <div className="day-col">Tue<br/>23</div>
                <div className="day-col active">Wed<br/>24</div>
                <div className="day-col">Thu<br/>25</div>
                <div className="day-col">Fri<br/>26</div>
                <div className="day-col">Sat<br/>27</div>
            </div>
            <div className="timeline">
                <div className="time-row">
                    <div className="time-label">8:00 am</div>
                    <div className="event-track">
                        <div className="event dark-event" style={{width: '60%', marginLeft: '20%'}}>
                            <div className="event-info">
                                <strong>Weekly Team Sync</strong>
                                <span>Discuss progress on projects</span>
                            </div>
                            <div className="event-avatars">
                                <img src="/profile-image.jpg" alt="av" />
                                <img src="/profile-image.jpg" alt="av" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="time-row">
                    <div className="time-label">9:00 am</div>
                    <div className="event-track"></div>
                </div>
                <div className="time-row">
                    <div className="time-label">10:00 am</div>
                    <div className="event-track">
                            <div className="event light-event" style={{width: '50%', marginLeft: '40%'}}>
                            <div className="event-info">
                                <strong>Onboarding Session</strong>
                                <span>Introduction for new hires</span>
                            </div>
                            <div className="event-avatars">
                                <img src="/profile-image.jpg" alt="av" />
                                <img src="/profile-image.jpg" alt="av" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="time-row">
                    <div className="time-label">11:00 am</div>
                    <div className="event-track"></div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;

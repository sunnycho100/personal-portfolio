

const ProgressChart = () => {
    return (
        <div className="card progress-card">
            <div className="card-top">
                <div className="card-titles">
                    <h3>Progress</h3>
                    <div className="big-val">6.1 h <span>Work Time<br/>this week</span></div>
                </div>
                <button className="icon-link"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10"></path></svg></button>
            </div>
            <div className="bar-chart">
                <div className="bar-item">
                    <div className="bar dark" style={{height: '30%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">S</span>
                </div>
                <div className="bar-item">
                    <div className="bar dark" style={{height: '70%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">M</span>
                </div>
                <div className="bar-item">
                    <div className="bar dark" style={{height: '65%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">T</span>
                </div>
                <div className="bar-item">
                    <div className="bar dark" style={{height: '40%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">W</span>
                </div>
                <div className="bar-item active-bar">
                    <div className="tooltip">5h 23m</div>
                    <div className="bar yellow" style={{height: '85%'}}></div>
                    <div className="dot yellow"></div>
                    <span className="day">T</span>
                </div>
                <div className="bar-item">
                    <div className="bar dark" style={{height: '25%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">F</span>
                </div>
                <div className="bar-item">
                    <div className="bar dark" style={{height: '15%'}}></div>
                    <div className="dot dark"></div>
                    <span className="day">S</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;

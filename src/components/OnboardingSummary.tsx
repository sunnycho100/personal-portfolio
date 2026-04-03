

const OnboardingSummary = () => {
    return (
        <div className="card onboarding">
            <div className="card-top">
                <h3>Onboarding</h3>
                <div className="big-percent">18%</div>
            </div>
            <div className="onboard-bars">
                <div className="onboard-col">
                    <span className="pct">30%</span>
                    <div className="obot-bar yellow">Task</div>
                </div>
                <div className="onboard-col">
                    <span className="pct">25%</span>
                    <div className="obot-bar dark-lg"></div>
                </div>
                <div className="onboard-col">
                    <span className="pct">0%</span>
                    <div className="obot-bar dark-sm"></div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSummary;

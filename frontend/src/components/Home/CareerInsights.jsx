import React from 'react';

const CareerInsights = () => {
    const insights = [
        {
            title: "Remote Work Trend",
            percentage: 73,
            description: "of tech jobs now offer remote options",
            trend: "up",
            icon: "🏠"
        },
        {
            title: "Salary Growth",
            percentage: 12,
            description: "average increase in tech salaries this year",
            trend: "up",
            icon: "💰"
        },
        {
            title: "Job Openings",
            percentage: 45,
            description: "more positions available compared to last year",
            trend: "up",
            icon: "📈"
        },
        {
            title: "Skills Demand",
            percentage: 89,
            description: "of employers prioritize technical skills",
            trend: "up",
            icon: "🎯"
        }
    ];

    const getTrendIcon = (trend) => {
        return trend === 'up' ? '📊' : '📉';
    };

    return (
        <section className="CareerInsightsSection">
            <div className="SectionHeader">
                <h2>Career Insights</h2>
                <button className="ViewAllButton">
                    View Full Report
                </button>
            </div>
            <div className="InsightsGrid">
                {insights.map((insight, index) => (
                    <div key={index} className="InsightCard">
                        <div className="InsightHeader">
                            <span className="InsightIcon">{insight.icon}</span>
                            <span className="TrendIcon">{getTrendIcon(insight.trend)}</span>
                        </div>
                        <div className="InsightContent">
                            <h3>{insight.title}</h3>
                            <div className="PercentageDisplay">
                                <span className="PercentageNumber">{insight.percentage}%</span>
                                <div className="PercentageBar">
                                    <div 
                                        className="PercentageFill" 
                                        style={{ width: `${insight.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="InsightDescription">{insight.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CareerInsights;

import React, { useState } from 'react';

const EnhancedSearchBar = ({ onSearch, searchTitle, searchCompany, searchLocation, setSearchTitle, setSearchCompany, setSearchLocation }) => {
    const handleSearch = () => {
        onSearch();
    };

    return (
        <div className="SearchBar">
            <div className="SearchInputGroup">
                <input
                    type="text"
                    placeholder="🔍 Job title or keyword..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="🏢 Company..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="📍 Location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                />
                <button onClick={handleSearch} className="SearchButton">
                    Search Jobs
                </button>
            </div>
            <div className="QuickSearch">
                <span>Popular searches:</span>
                <button onClick={() => setSearchTitle("Remote")}>Remote</button>
                <button onClick={() => setSearchTitle("Full-time")}>Full-time</button>
                <button onClick={() => setSearchTitle("Software")}>Software</button>
                <button onClick={() => setSearchTitle("Design")}>Design</button>
                <button onClick={() => setSearchTitle("Marketing")}>Marketing</button>
                <button onClick={() => setSearchTitle("Data Science")}>Data Science</button>
                <button onClick={() => setSearchTitle("Sales")}>Sales</button>
                <button onClick={() => setSearchTitle("Healthcare")}>Healthcare</button>
                <button onClick={() => setSearchTitle("Finance")}>Finance</button>
                <button onClick={() => setSearchTitle("Education")}>Education</button>
                <button onClick={() => setSearchTitle("Engineering")}>Engineering</button>
                <button onClick={() => setSearchTitle("Customer Service")}>Customer Service</button>
            </div>
        </div>
    );
};

export default EnhancedSearchBar;

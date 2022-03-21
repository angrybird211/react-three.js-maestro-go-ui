import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SortBox = ({ title }) => {
    const [iconIndex, setIconIndex] = useState(0);
    const icons = ["fa-solid fa-bars-sort", "fa-light fa-greater-than", "fa-light fa-less-than", "fa-light fa-equals", "fa-light fa-not-equal"];

    return (
        <>
            <input type="text" placeholder={title} />

            <div>
                <span><i className={icons[iconIndex]}></i></span>
                <div className="select-box">
                    <div className="select-items">
                        <div className="select-item" onClick={() => { setIconIndex(0) }}><i className="fa-solid fa-bars-sort"></i></div>
                        <div className="select-item" onClick={() => { setIconIndex(1) }}><i className="fa-light fa-greater-than"></i></div>
                        <div className="select-item" onClick={() => { setIconIndex(2) }}><i className="fa-light fa-less-than"></i></div>
                        <div className="select-item" onClick={() => { setIconIndex(3) }}><i className="fa-light fa-equals"></i></div>
                        <div className="select-item" onClick={() => { setIconIndex(4) }}><i className="fa-light fa-not-equal"></i></div>
                    </div>
                </div>
            </div>
        </>)
}

SortBox.propTypes = {
    title: PropTypes.string
}

export default SortBox;
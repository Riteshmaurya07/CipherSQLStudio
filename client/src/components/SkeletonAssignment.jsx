import React from 'react';
import '../styles/SkeletonAssignment.scss';

const SkeletonAssignment = () => {
    return (
        <div className="skeleton-assignment">
            <div className="skeleton-assignment__title"></div>
            <div className="skeleton-assignment__description">
                <div className="skeleton-assignment__description-line"></div>
                <div className="skeleton-assignment__description-line"></div>
                <div className="skeleton-assignment__description-line"></div>
            </div>
            <div className="skeleton-assignment__footer"></div>
        </div>
    );
};

export default SkeletonAssignment;

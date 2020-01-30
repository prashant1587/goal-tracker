import React from 'react';
import GoalsComponent from './goals.component';
class  SidePanelComponent extends React.Component {

    render() {
        return (
            <div className="side-panel">
                <GoalsComponent />
            </div>
        );
    }
}

export default SidePanelComponent;

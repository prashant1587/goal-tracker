import React from 'react';
import SidePanelComponent from './goal-container/side-panel.component';
import CalendarContainerComponent from './calendar/calendar-container.component';

class  ContainerComponent extends React.Component {
    render() {
        return (
            <div className="component-container">
                <SidePanelComponent/>
                <CalendarContainerComponent/>
            </div>
        );
    }
}

export default ContainerComponent;

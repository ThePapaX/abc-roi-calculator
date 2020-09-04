import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as RoiCalculatorStore from '../store/RoiCalculator';
import LoadingSpinner from './LoadingSpinner';
import InvestmentOptionsPanel from './InvestmentOptionsPanel';
import RoiResultPanel from './RoiResultPanel';

import { Pane, Tablist, SidebarTab } from 'evergreen-ui'

export type RoiCalculatorProps =
    RoiCalculatorStore.RoiCalculatorState &
    typeof RoiCalculatorStore.actionCreators;

class RoiCalculator extends React.PureComponent<RoiCalculatorProps> {
    public componentDidMount() {
        this.ensureInvestmentOptionsFetched();
    }

    private ensureInvestmentOptionsFetched() {
        this.props.requestInvestmentOptions();
    }

    public render() {
        return (
            <Pane display="flex" >
                <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                    {this.props.tabs.map((tab, index: number) => (
                        <SidebarTab
                            key={tab}
                            id={tab}
                            onSelect={() => tab === 'ROI' ? this.props.calculateRoi() : this.props.changeTab(index)}
                            isSelected={index === this.props.currentTabIndex}
                            aria-controls={`panel-${tab}`}
                        >
                            {tab}
                        </SidebarTab>
                    ))}
                </Tablist>
                <Pane padding={16} background="tint1" flex="1">
                    {this.props.tabs.map((tab, index) => (
                        <Pane
                            key={tab}
                            id={`panel-${tab}`}
                            role="tabpanel"
                            aria-labelledby={tab}
                            aria-hidden={index !== this.props.currentTabIndex}
                            display={index === this.props.currentTabIndex ? 'block' : 'none'}
                        >
                            {this.props.isLoading && <LoadingSpinner />}
                            {!this.props.isLoading && index === 0 && <InvestmentOptionsPanel {...this.props} />}
                            {!this.props.isLoading && index === 1 && <RoiResultPanel {...this.props} />}
                        </Pane>
                    ))}
                </Pane>
            </Pane>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.roiCalculator, // Selects which state properties are merged into the component's props
    RoiCalculatorStore.actionCreators // Selects which action creators are merged into the component's props
)(RoiCalculator as any);
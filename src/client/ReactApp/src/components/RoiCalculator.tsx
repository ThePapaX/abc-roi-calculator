import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as RoiCalculatorStore from '../store/RoiCalculator';

import { Pane, Tablist, SidebarTab, Paragraph } from 'evergreen-ui'

type RoiCalculatorProps =
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
            <Pane display="flex" height={240}>
              <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                {this.props.tabs.map((tab, index :number) => (
                  <SidebarTab
                    key={tab}
                    id={tab}
                    onSelect={() => this.props.changeTab(index)}
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
                    <Paragraph>Panel {tab}</Paragraph>
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
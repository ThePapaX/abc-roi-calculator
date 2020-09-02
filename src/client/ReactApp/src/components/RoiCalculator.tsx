import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as RoiCalculatorStore from '../store/RoiCalculator';

import { Pane, Tablist, SidebarTab, Paragraph, Spinner, TextInputField, Badge, Text } from 'evergreen-ui'
import InvestmentOptionsList from './InvestmentOptionsList';

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

    private renderSpinner(){
        return (
        <Pane display="flex" alignItems="center" justifyContent="center" height={200}>
            <Spinner />
        </Pane>);
    }

    private renderInvestmentPanel() {
        return (<React.Fragment>
            <TextInputField
            isInvalid
            required
            label="Investment amount"
            description="Total Investment in AUD."
            type = "number"
            min={0}
            value = {100000}
            validationMessage="This field is required"
        />
        
        <Badge style={{textTransform:'none', display: 'inline'}} padding={8}>Available Amount: 100,000</Badge>
        <InvestmentOptionsList 
            investmentOptions={this.props.investmentOptions} 
            investmentAllocation={this.props.investmentAllocation}
            onOptionSelected={(groupId: number, value: number)=>{ console.warn('OPTION_SELECTED on group:', groupId, 'value:', value)}}
            onOptionRemoved={(groupId: number, value: number)=>{ console.warn('ALLOCATION_CHANGE on group:', groupId, 'value:', value)}}
            onOptionAdded={()=>{}}
                    
        />
        
        </React.Fragment>);
    }
    private renderRoiPanel(){
        return (<React.Fragment><Paragraph>ROI Panel</Paragraph></React.Fragment>)
    }

    public render() {
        return (
            <Pane display="flex" >
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
                      {this.props.isLoading && this.renderSpinner()}
                      {!this.props.isLoading && index === 0 && this.renderInvestmentPanel()}
                      {!this.props.isLoading && index === 1 && this.renderRoiPanel()} 
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
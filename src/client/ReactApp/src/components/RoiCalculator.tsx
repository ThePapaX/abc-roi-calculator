import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as RoiCalculatorStore from '../store/RoiCalculator';
import { CurrencyFormatter, PercentageFormatter } from '../utilities/numberFormaters';

import { Pane, Tablist, SidebarTab, Paragraph, Spinner, TextInputField, Badge, Text, Button, CalculatorIcon, Alert } from 'evergreen-ui'
import InvestmentOptionsList from './InvestmentOptionsList';

type RoiCalculatorProps =
    RoiCalculatorStore.RoiCalculatorState &
    typeof RoiCalculatorStore.actionCreators;


const onlyNumber = () => {
    return {
        onKeyPress: (event: React.KeyboardEvent) => {
            console.log(event.key, event.keyCode, event.which, parseInt(event.key), isNaN(parseFloat(event.key)))
            if (isNaN(parseFloat(event.key))) {
                event.preventDefault();
                return false;
            }

            console.log('keydown acccepted');
        }
    }
}

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

    private isValidInvestmentAmount = () => this.props.investmentAmount && this.props.investmentAmount > 0;
    private availableAmount = () => this.props.investmentAmount * (1 - this.props.investedPercentage / 100);
    private currencyFormatter = new CurrencyFormatter('en-au', 'AUD');
    private percentageFormatter = new PercentageFormatter();

    private renderInvestmentPanel() {
        return (<Pane>
            <TextInputField
            isInvalid={!this.isValidInvestmentAmount()}
            required
            label="Investment amount"
            type="number"
            description="Total Investment in AUD."
            min={0}
            // value = {this.currencyFormatter.format(this.props.investmentAmount)}
            value = {this.props.investmentAmount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.props.setInvestmentAmount(event.target.value ? parseFloat(event.target.value) : '')}
    
            validationMessage={ !this.isValidInvestmentAmount() ? "This field is invalid" : null}
        />
        
        <Badge style={{textTransform:'none', display: 'inline'}} color={this.availableAmount() >= 0 && !(!this.props.validation.hasValidated ===false && !this.props.validation.isValid)  ? 'neutral' : 'red'} padding={8}>Available Amount: {this.currencyFormatter.format(this.availableAmount())}</Badge>
        {this.props.validation.globalErrorMessage && this.props.validation.hasValidated &&
            <Pane marginTop={24}>
                <Alert intent="danger" title={this.props.validation.globalErrorMessage} />
            </Pane>
        }
        <InvestmentOptionsList 
            investmentOptions={this.props.investmentOptions} 
            investmentAllocation={this.props.investmentAllocation}
            investmentRowsState = {this.props.investmentRowsState}
            maxRowCount = {this.props.investmentOptions.length}

            onOptionSelected={this.props.setInvestmentOption}
            onOptionRemoved={this.props.removeInvestmentOption}
            onOptionAdded={this.props.addInvestmentOption}
            onAllocationChanged={this.props.setInvestmentAllocation}

            rowsValidation={this.props.validation.rowsValidation}
            
        />
        <Pane>
            <Button appearance="primary" intent="none" iconAfter={CalculatorIcon} onClick={this.props.calculateRoi}>Calculate ROI</Button>
        </Pane>
        </Pane>
        );
    }
    private renderRoiPanel() {
        const currencyFormatter = new CurrencyFormatter('en-au', this.props.result.currency);

        return (<Pane display="flex">
            <Pane flexGrow={2} float="left" margin={8}>
                <TextInputField margin={0}
                    label="Projected return in 1 year"
                    value={currencyFormatter.format(this.props.result.total)}
                    disabled
                />
            </Pane>
            <Pane float="left" margin={8}>
                <TextInputField margin={0}
                    label="Total fees"
                    value={currencyFormatter.format(this.props.result.fees)}
                    disabled
                />
            </Pane>

        </Pane>)
    }

    public render() {
        return (
            <Pane display="flex" >
              <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                {this.props.tabs.map((tab, index :number) => (
                  <SidebarTab
                    key={tab}
                    id={tab}
                    onSelect={() => tab ==='ROI' ? this.props.calculateRoi() : this.props.changeTab(index)}
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
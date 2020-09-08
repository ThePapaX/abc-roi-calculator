import React from 'react';
import { Pane, TextInputField, Badge, Alert, Button, CalculatorIcon } from 'evergreen-ui'
import { CurrencyFormatter } from '../utilities/numberFormaters';
import InvestmentOptionsList from './InvestmentOptionsList';
import { RoiCalculatorProps } from './RoiCalculator';

const InvestmentOptionsPanel: React.FC<RoiCalculatorProps> = (props) => {
    const currencyFormatter = new CurrencyFormatter(props.locale, props.currency);
    const isValidInvestmentAmount = () => props.investmentAmount && props.investmentAmount > 0;
    const availableAmount = () => props.investmentAmount * (1 - props.investedPercentage / 100);

    return (<Pane>
        <TextInputField
            isInvalid={!isValidInvestmentAmount()}
            required
            label="Investment amount"
            type="number"
            description="Total Investment in AUD."
            min={0}
            // value = {this.currencyFormatter.format(props.investmentAmount)}
            value={props.investmentAmount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setInvestmentAmount(event.target.value ? parseFloat(event.target.value) : '')}

            validationMessage={!isValidInvestmentAmount() ? "Invalid Investment amount" : null}
        />

        <Badge style={{ textTransform: 'none', display: 'inline' }}
            color={availableAmount() >= 0 && !(!props.validation.hasValidated === false && !props.validation.isValid) ? 'neutral' : 'red'} padding={8}>
            Available Amount: {currencyFormatter.format(availableAmount())}
        </Badge>

        {props.validation.globalErrorMessage && props.validation.hasValidated &&
            <Pane marginTop={24}>
                <Alert intent="danger" title={props.validation.globalErrorMessage} />
            </Pane>
        }
        <InvestmentOptionsList
            investmentOptions={props.investmentOptions}
            investmentAllocation={props.investmentAllocation}
            investmentRowsState={props.investmentRowsState}
            maxRowCount={props.investmentOptions.length}

            onOptionSelected={props.setInvestmentOption}
            onOptionRemoved={props.removeInvestmentOption}
            onOptionAdded={props.addInvestmentOption}
            onAllocationChanged={props.setInvestmentAllocation}

            rowsValidation={props.validation.rowsValidation}

        />
        <Pane>
            <Button appearance="primary" intent="none" iconAfter={CalculatorIcon} onClick={props.calculateRoi}>Calculate ROI</Button>
        </Pane>
    </Pane>
    );
}

export default InvestmentOptionsPanel;
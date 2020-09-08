import { InvestmentOptionRowValidationState } from '../components/InvestmentOptionRow';

export interface InvestmentRowsState {
    rowCount: number,
    canAddRows: boolean,
    canRemoveRows: boolean
}

export interface RoiCalculatorState {
    locale: string,
    currency: string,
    investmentAmount: number,
    investedPercentage: number,
    currentTabIndex: number;
    tabs: Array<string>;
    investmentOptions: Array<InvestmentOption>;
    investmentAllocation: Array<InvestmentOptionGroup>;
    validation: ValidationState;
    isLoading: boolean;
    investmentRowsState: InvestmentRowsState;
    result: RoiCalculationResult,
    shouldRecalculate?: boolean,
}

export interface InvestmentOption {
    id: number;
    name: string;
    allocatedProportion?: number;
}

export interface InvestmentOptionGroup extends InvestmentOption {
    groupId: number
}

export interface RoiCalculationResult {
    total: number,
    fees: number,
    currency: string,
    exchangeRateMetadata?: any
}

export interface RoiCalculationRequest {
    baseCurrency: string,
    investmentAmount: number,
    investmentOptions: Array<InvestmentOption>
}

export interface ValidationError {
    type: string,
    property: string,
    message: string
}
export interface rowValidationDictionary { [groupId: number]: InvestmentOptionRowValidationState }

export interface ValidationState {
    isValid: boolean,
    hasValidated: boolean,
    globalErrorMessage?: string,
    errors?: Array<ValidationError>,
    rowsValidation: rowValidationDictionary
}
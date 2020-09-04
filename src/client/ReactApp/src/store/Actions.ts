// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

import { RoiCalculationRequest, RoiCalculationResult, InvestmentOption, ValidationState } from "./StoreDefs";

export interface ChangeTabAction { 
    type: 'CHANGE_TAB';
    tabIndex: number 
}

export interface RequestRoiCalculationAction {
    type: 'REQUEST_ROI_CALCULATION';
    requestBody: RoiCalculationRequest;
}

export interface ReceiveRoiCalculationAction {
    type: 'RECEIVE_ROI_CALCULATION';
    result: RoiCalculationResult;
}

export interface RequestInvestmentOptionsAction {
    type: 'REQUEST_INVESTMENT_OPTIONS'
}

export interface ReceiveInvestmentOptionsAction {
    type: 'RECEIVE_INVESTMENT_OPTIONS';
    investmentOptions: Array<InvestmentOption>;
}

export interface InvestmentOptionRowAddedAction {
    type : 'INVESTMENT_OPTION_ROW_ADDED',
    groupId : number
}
export interface InvestmentOptionRowRemovedAction {
    type : 'INVESTMENT_OPTION_ROW_REMOVED',
    groupId : number
}

export interface InvestmentOptionSelectedAction {
    type : 'INVESTMENT_OPTION_SELECTED',
    groupId : number,
    optionId : number
}

export interface InvestmentOptionAllocationChangedAction {
    type : 'INVESTMENT_OPTION_ALLOCATION_CHANGED',
    groupId : number,
    allocation : number,
}

export interface InvestmentAmountChangedAction {
    type : 'INVESTMENT_AMOUNT_CHANGED',
    investmentAmount : number
}

export interface RoiCalculationRequestedAction {
    type : 'ROI_CALCULATION_REQUESTED',
}

export interface RoiCalculationReceivedAction {
    type : 'ROI_CALCULATION_RECEIVED',
    result : RoiCalculationResult
}

export interface ValidationFailedAction{
    type : 'VALIDATION_FAILED',
    validation : ValidationState,
}
export interface ValidationPassedAction{
    type : 'VALIDATION_PASSED',
    validation : ValidationState,
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RoiCalculationRequestedAction | RoiCalculationReceivedAction | ValidationFailedAction | ValidationPassedAction | ChangeTabAction | InvestmentAmountChangedAction | RequestRoiCalculationAction | ReceiveRoiCalculationAction | RequestInvestmentOptionsAction | ReceiveInvestmentOptionsAction | InvestmentOptionRowAddedAction | InvestmentOptionRowRemovedAction |  InvestmentOptionSelectedAction | InvestmentOptionAllocationChangedAction;
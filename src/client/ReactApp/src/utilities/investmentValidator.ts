import { RoiCalculatorState, ValidationState } from '../store/StoreDefs';
import { InvestmentOptionRowValidationState } from '../components/InvestmentOptionRow';


const errorMessages = {
    DUPLICATED_INVESTMENT_OPTION : 'This option is already selected',
    EMPTY_INVESTMENT_OPTION : 'Please select an investment option',
    INVALID_ALLOCATION_AMOUNT : 'Must be between 0 - 100%',
    OVERINVESTED : 'The total allocation is larger than the investment amount',
    UNDERINVESTED : 'You haven\'t invested 100%',
    INVALID_VALUE : 'Invalid value',
    
}

class RowValidation implements InvestmentOptionRowValidationState{
    option = {
        isValid : true,
        message : ''
    }
    allocation = {
        isValid : true,
        message : ''
    }
}

 
const validate = (state: RoiCalculatorState) : ValidationState => {
    const duplicatedInvestmentsMap : {[id : number] : any} = {};
    
    const validationResult : ValidationState = {
        isValid : true,
        hasValidated : true,
        globalErrorMessage : undefined,
        rowsValidation: {}
    }

    // Invested amount must be 100%
    if( state.investedPercentage !==100 ){
        validationResult.isValid = false;
        validationResult.globalErrorMessage = state.investedPercentage < 100 ? errorMessages.UNDERINVESTED : errorMessages.OVERINVESTED
    }
    

    state.investmentAllocation.forEach(investmentOption=>{

        // An applicable investment is one that has either a selected option or an allocation value.
        const isApplicable = investmentOption.id > 0 || ( investmentOption.allocatedProportion && investmentOption.allocatedProportion > 0 );
        if(!isApplicable) return;

        const rowValidation = new RowValidation();

        // Check empty allocation
        if(investmentOption.id > 0 && !investmentOption.allocatedProportion){
            validationResult.isValid = false;
            rowValidation.allocation.isValid = false;
            rowValidation.allocation.message = errorMessages.INVALID_ALLOCATION_AMOUNT;
        }

        // Check duplication
        if(duplicatedInvestmentsMap.hasOwnProperty(investmentOption.id)){
            validationResult.isValid = false;
            rowValidation.option.isValid = false;
            rowValidation.option.message = errorMessages.DUPLICATED_INVESTMENT_OPTION
        }

        // Check missing option
        if(investmentOption.allocatedProportion && investmentOption.id < 0){
            validationResult.isValid = false;
            rowValidation.option.isValid = false;
            rowValidation.option.message = errorMessages.EMPTY_INVESTMENT_OPTION
        }

        // Check allocation
        if(investmentOption.allocatedProportion && (investmentOption.allocatedProportion > 100 || investmentOption.allocatedProportion < 0)){
            validationResult.isValid = false;
            rowValidation.allocation.isValid = false;
            rowValidation.allocation.message = errorMessages.INVALID_ALLOCATION_AMOUNT
        }


        duplicatedInvestmentsMap[investmentOption.id]  = false; 

        validationResult.rowsValidation[investmentOption.groupId] = rowValidation;
    })
    return validationResult;
}

export default validate;
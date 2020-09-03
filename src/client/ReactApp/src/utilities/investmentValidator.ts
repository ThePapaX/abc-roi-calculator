import { RoiCalculatorState, ValidationState, rowValidationDictionary, ValidationError } from '../store/RoiCalculator';
import { InvestmentOptionRowValidationState } from '../components/InvestmentOptionRow';


const errorMessages = {
    DUPLICATED_INVESTMENT_OPTION : 'Duplicated investment. Please adjust.',
    INVALID_ALLOCATION_AMOUNT : 'Individual allocation must be between 0 - 100%',
    OVERINVESTED : 'The total allocation is larger than the investment amount',
    UNDERINVESTED : 'You haven\'t invested 100%',
    INVALID_VALUE : 'Invalid value'
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
    const duplicatedInvestmentsMap = {};
    
    const validationResult : ValidationState = {
        isValid : true,
        hasValidated : true,
        rowsValidation: {}
    }

    state.investmentAllocation.forEach(investmentOption=>{

        // An applicable investment is one that has either a selected option or an allocation value.
        const isApplicable = investmentOption.id > 0 || investmentOption.allocatedProportion && investmentOption.allocatedProportion > 0;
        if(!isApplicable) return;

        const rowValidation = new RowValidation();

        //Check duplication
        if(duplicatedInvestmentsMap.hasOwnProperty(investmentOption.id)){
            validationResult.isValid = false;
            rowValidation.option.isValid = false;
            rowValidation.option.message = errorMessages.DUPLICATED_INVESTMENT_OPTION
        }

        //Check allocation
        if(investmentOption.allocatedProportion && (investmentOption.allocatedProportion > 100 || investmentOption.allocatedProportion < 0)){
            validationResult.isValid = false;
            rowValidation.allocation.isValid = false;
            rowValidation.allocation.message = errorMessages.INVALID_ALLOCATION_AMOUNT
        }

        validationResult.rowsValidation[investmentOption.groupId] = rowValidation;
    })
    return validationResult;
}

export default validate;
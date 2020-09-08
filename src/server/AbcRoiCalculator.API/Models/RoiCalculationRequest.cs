using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiCalculationRequest : IValidatableObject
    {
        [Required]
        public string BaseCurrency { get; set; }

        public string TargetCurrency { get; set; }

        public double InvestmentAmount { get; set; }

        public List<InvestmentOptionBase> InvestmentOptions { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var results = new List<ValidationResult>();
            if (InvestmentAmount < 0)
            {
                yield return new ValidationResult(ValidationMessages.INVALID_INVESTMENT_AMOUNT, new[] { nameof(InvestmentAmount) });
            }

            if (InvestmentOptions == null || InvestmentOptions.Count < 0)
            {
                yield return new ValidationResult(ValidationMessages.INVESTMENT_OPTIONS_CANNOT_BE_EMPTY, new[] { nameof(InvestmentOptions) });
            }

            if (InvestmentOptions != null && InvestmentOptions.Sum(op => op.AllocatedProportion) != 1)
            {
                yield return new ValidationResult(ValidationMessages.TOTAL_INVESTMENT_ALLOCATION_MUST_BE_100_PERCENT, new[] { nameof(InvestmentOptions) });
            }
        }
    }
}
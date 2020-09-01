using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiCalculationRequest : IValidatableObject
    {
        [Required]
        public string BaseCurrency { get; set; }
        public string TargetCurrency { get; set; }
        
        public double InvestmentAmount { get; set; }
        
        public List<InvestmentOption> InvestmentOptions { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var results = new List<ValidationResult>();
            if(InvestmentAmount < 0)
            {
                yield return new ValidationResult($"The Investment amount is invalid", new[] { nameof(InvestmentAmount) });
            }

            if (InvestmentOptions == null || InvestmentOptions.Count < 0)
            {
                yield return new ValidationResult($"There must be at least 1 investment option", new[] { nameof(InvestmentOptions) });
            }
            
            if(InvestmentOptions != null && InvestmentOptions.Sum(op => op.AllocatedProportion) != 1)
            {
                yield return new ValidationResult($"Total investment allocation must equal 100%", new[] { nameof(InvestmentOptions) });
            }

        }
    }
}

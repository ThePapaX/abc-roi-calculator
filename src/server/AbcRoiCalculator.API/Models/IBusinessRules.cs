using System.Collections.Generic;

namespace AbcRoiCalculatorApp.Models
{
    public interface IBusinessRules
    {
        public List<InvestmentOption> InvestmentBusinessRules { get; set; }
        public double BaseFee { get; set; }

        public string BaseCurrency { get; set; }

        public string TargetCurrency { get; set; }
    }
}
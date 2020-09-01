using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiConfiguration : IBusinessRules
    {
        public Dictionary<int, InvestmentOptionRule> InvestmentBusinessRules { get; set; }
        public double BaseFee { get; set; }
        public string BaseCurrency { get; set; }
        public string TargetCurrency { get; set; }
    }
}

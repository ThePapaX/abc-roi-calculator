using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiConfigurationOptions : IBusinessRules
    {
        public const string RoiConfiguration = "RoiConfiguration";
        public List<InvestmentOption> InvestmentBusinessRules { get; set; }
        public double BaseFee { get; set; }
        public string BaseCurrency { get; set; }
        public string TargetCurrency { get; set; }

        public RoiConfigurationOptions()
        {
            InvestmentBusinessRules = new List<InvestmentOption>();
        }
    }
}

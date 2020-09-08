﻿using System.Collections.Generic;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiBusinessRules : IBusinessRules
    {
        public const string RoiConfiguration = "RoiConfiguration";
        public List<InvestmentOption> InvestmentBusinessRules { get; set; }
        public double BaseFee { get; set; }
        public string BaseCurrency { get; set; }
        public string TargetCurrency { get; set; }

        public RoiBusinessRules()
        {
            InvestmentBusinessRules = new List<InvestmentOption>();
        }
    }
}
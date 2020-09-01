﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiCalculationResult
    {
        public double Total { get; set; }
        public double Fees { get; set; }
        public string Currency { get; set; }
        public string ExchangeRateMetadata { get; set; }
    }
}

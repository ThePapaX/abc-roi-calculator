using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOptionRule : IComparable<InvestmentOptionRule>
    {
        public double From { get; set; }
        public double To { get; set; }
        public double Roi { get; set; }
        public double Fee { get; set; }
        public InvestmentOptionRule(double from, double to, double roi, double fee)
        {
            From = from;
            To = to;
            Roi = roi;
            Fee = fee;
        }
        public InvestmentOptionRule()
        {

        }

        /// <summary>method <c>IsApplicable</c> checks if the investment allocation is within this Rule's bounds.</summary>
        public bool IsApplicableForProportion(double investmentProportion)
        {
            return (From.CompareTo(investmentProportion) <= 0) && (investmentProportion.CompareTo(To) <= 0);
        }

        public int CompareTo([AllowNull] InvestmentOptionRule other)
        {
            throw new NotImplementedException();
        }
    }

    class InvestmentOptionRangeComparer : IComparer<double>
    {

        // Using the upper bound "To" as the sorting value;
        public int Compare([AllowNull] InvestmentOptionRule x, [AllowNull] InvestmentOptionRule y)
        {
            return x.To.CompareTo(y.To);
        }

        public int Compare([AllowNull] double x, [AllowNull] double y)
        {
            return x.CompareTo(y);
        }
    }
}

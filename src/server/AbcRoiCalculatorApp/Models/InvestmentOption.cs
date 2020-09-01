using Microsoft.AspNetCore.Mvc.Localization;

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOption : IEquatable<InvestmentOption>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double AllocatedProportion { get; set; }
        
        public InvestmentOption(int id, string name, double allocatedProportion = 0)
        {
            Id = id;
            Name = name;
            AllocatedProportion = allocatedProportion;
        }

        public bool Equals([AllowNull] InvestmentOption other) => this.Id == other.Id;

        public override bool Equals(object obj)
        {
            return this.Equals(obj as InvestmentOption);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public static bool operator == (InvestmentOption lhs, InvestmentOption rhs) => lhs.Id == rhs.Id;
        public static bool operator !=(InvestmentOption lhs, InvestmentOption rhs) => lhs.Id != rhs.Id;
    }
}

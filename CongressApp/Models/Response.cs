using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class Response
    {
        public bool IsSuccess { get; set; }
        public dynamic Data { get; set; }
        public string Error { get; set; }
    }
}

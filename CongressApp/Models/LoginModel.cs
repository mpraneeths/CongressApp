using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class UserModel
    {
        public string User { get; set; }
        public string Surname { get; set; }
        public string Role { get; set; }
        public string MemberId { get; set; }
        public string EmailId { get; set; }
        public string Twitter { get; set; }
        public string Facebook { get; set; }
        public string Mobile { get; set; }
        public string Name { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
    }
}

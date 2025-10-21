using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace InterviewTest.Server.Model
{
    public class GroupResult
    {
        public string Key { get; set; }
        public int Total { get; set; }
    }
}

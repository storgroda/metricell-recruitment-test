using System.ComponentModel.DataAnnotations;

namespace InterviewTest.Server.Model
{
    public class Employee
    {
        [Key]
        public int RowId { get; set; }

        public string Name { get; set; }
        public int Value { get; set; }
    }
}

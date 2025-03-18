using System.Text.Json.Serialization;

namespace MyToDoApp.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Completed { get; set; }

        public bool IsImportant { get; set; } // false - звичайна, true - важлива

        // Додано:
        [JsonIgnore]
        public string? OwnerId { get; set; }          // Зовнішній ключ
        [JsonIgnore]
        public virtual ApplicationUser? Owner { get; set; }   // Навігаційна властивість
    }
}

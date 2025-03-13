namespace MyToDoApp.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime? DueDate { get; set; }
    public bool Completed { get; set; }
}

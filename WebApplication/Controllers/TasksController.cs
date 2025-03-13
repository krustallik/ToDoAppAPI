using Microsoft.AspNetCore.Mvc;
using MyToDoApp.Models;

namespace MyToDoApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    // Тимчасове зберігання в пам'яті
    private static List<TaskItem> _tasks = new List<TaskItem>();

    // GET: api/tasks
    [HttpGet]
    public IActionResult GetAllTasks()
    {
        return Ok(_tasks);
    }

    // GET: api/tasks/5
    [HttpGet("{id}")]
    public IActionResult GetTaskById(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public IActionResult CreateTask([FromBody] TaskItem newTask)
    {
        // Генеруємо Id
        newTask.Id = newTask.Id == 0
            ? new System.Random().Next(1, 999999999)
            : newTask.Id;

        _tasks.Add(newTask);
        return CreatedAtAction(nameof(GetTaskById), new { id = newTask.Id }, newTask);
    }

    // PUT: api/tasks/5
    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] TaskItem updatedTask)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null) return NotFound();

        task.Name = updatedTask.Name;
        task.DueDate = updatedTask.DueDate;
        task.Completed = updatedTask.Completed;

        return NoContent();
    }

    // DELETE: api/tasks/5
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null) return NotFound();

        _tasks.Remove(task);
        return NoContent();
    }
}
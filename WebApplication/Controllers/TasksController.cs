using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyToDoApp.Models;

namespace MyToDoApp.Controllers
{
    [Authorize] // Лише авторизованим користувачам
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TasksController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var userId = _userManager.GetUserId(User);

            // Вибираємо лише ті TaskItems, що належать поточному користувачу
            var tasks = await _context.TaskItems
                .Where(t => t.OwnerId == userId)
                .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var userId = _userManager.GetUserId(User);

            // Спочатку шукаємо TaskItem
            var task = await _context.TaskItems
                .FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);

            if (task == null) return NotFound();
            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem newTask)
        {
            var userId = _userManager.GetUserId(User);

            // Встановлюємо власника
            newTask.OwnerId = userId;

            _context.TaskItems.Add(newTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTaskById), new { id = newTask.Id }, newTask);
        }

        // PUT: api/tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var userId = _userManager.GetUserId(User);

            // Перевіряємо, чи існує TaskItem, який належить поточному користувачеві
            var task = await _context.TaskItems
                .FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);

            if (task == null) return NotFound();

            // Оновлюємо поля
            task.Name = updatedTask.Name;
            task.DueDate = updatedTask.DueDate;
            task.Completed = updatedTask.Completed;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = _userManager.GetUserId(User);

            var task = await _context.TaskItems
                .FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);

            if (task == null) return NotFound();

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

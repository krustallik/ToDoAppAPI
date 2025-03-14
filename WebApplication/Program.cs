using Microsoft.EntityFrameworkCore;
using MyToDoApp.Models; // простір імен з AppDbContext та ApplicationUser
using SQLitePCL; 

var builder = WebApplication.CreateBuilder(args);

// 1. Підключення до бази даних
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=MyToDoApp.db"));

// 2. Налаштування Identity з вашим ApplicationUser
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 1; // Мінімальна довжина пароля
    options.Password.RequiredUniqueChars = 0;
})
.AddEntityFrameworkStores<AppDbContext>();

// 3. Інші ваші сервіси
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
Batteries.Init();
// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 4. Порядок middlewares: 
app.UseStaticFiles();

// Потрібно обов'язково підключити аутентифікацію перед авторизацією
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();

using Microsoft.EntityFrameworkCore;
using MyToDoApp.Models; // ������ ���� � AppDbContext �� ApplicationUser
using SQLitePCL; 

var builder = WebApplication.CreateBuilder(args);

// 1. ϳ��������� �� ���� �����
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=MyToDoApp.db"));

// 2. ������������ Identity � ����� ApplicationUser
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 1; // ̳������� ������� ������
    options.Password.RequiredUniqueChars = 0;
})
.AddEntityFrameworkStores<AppDbContext>();

// 3. ���� ���� ������
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

// 4. ������� middlewares: 
app.UseStaticFiles();

// ������� ����'������ ��������� �������������� ����� ������������
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();

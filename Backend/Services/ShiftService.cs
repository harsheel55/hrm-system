using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ShiftService : IShiftService
    {
        private readonly AppDbContext _context;

        public ShiftService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShiftDto>> GetAllShiftsAsync()
        {
            return await _context.Shifts
                .Where(s => s.bolIsActive)
                .Select(s => new ShiftDto
                {
                    ShiftGuid = s.strShiftGUID,
                    Name = s.strName,
                    StartTime = s.tStartTime.ToString(@"hh\:mm"),
                    EndTime = s.tEndTime.ToString(@"hh\:mm"),
                    Color = s.strColor
                })
                .ToListAsync();
        }

        public async Task<ShiftDto> CreateShiftAsync(CreateShiftDto dto)
        {
            var shift = new Shift
            {
                strName = dto.Name,
                tStartTime = TimeSpan.Parse(dto.StartTime),
                tEndTime = TimeSpan.Parse(dto.EndTime),
                strColor = dto.Color
            };

            _context.Shifts.Add(shift);
            await _context.SaveChangesAsync();

            return new ShiftDto
            {
                ShiftGuid = shift.strShiftGUID,
                Name = shift.strName,
                StartTime = shift.tStartTime.ToString(@"hh\:mm"),
                EndTime = shift.tEndTime.ToString(@"hh\:mm"),
                Color = shift.strColor
            };
        }

        public async Task<ShiftPlannerViewDto> GetPlannerViewAsync(DateTime startDate, DateTime endDate)
        {
            var users = await _context.Users.Include(u => u.UserRole).ToListAsync();
            var shifts = await GetAllShiftsAsync();
            
            var startDateOnly = DateOnly.FromDateTime(startDate);
            var endDateOnly = DateOnly.FromDateTime(endDate);
            
            var assignments = await _context.EmployeeShifts
                .Include(a => a.Shift)
                .Where(a => a.dtDate >= startDateOnly && a.dtDate <= endDateOnly)
                .ToListAsync();

            var rowData = new List<EmployeeShiftGridRowDto>();
            
            foreach (var u in users)
            {
                var row = new EmployeeShiftGridRowDto
                {
                    UserGuid = u.strUserGUID,
                    UserName = u.strUserName,
                    Role = u.UserRole?.strRoleName ?? "Employee",
                    Department = u.UserRole?.strRoleName ?? "General", // Using role as dept placeholder if not specific
                    Days = new List<EmployeeShiftCellDto>()
                };

                for (var i = 0; i <= (endDate - startDate).Days; i++)
                {
                    var date = DateOnly.FromDateTime(startDate.AddDays(i));
                    var assignment = assignments.FirstOrDefault(a => a.strUserGUID == u.strUserGUID && a.dtDate == date);
                    
                    row.Days.Add(new EmployeeShiftCellDto
                    {
                        Date = date.ToString("yyyy-MM-dd"),
                        ShiftGuid = assignment?.strShiftGUID,
                        ShiftName = assignment?.Shift?.strName,
                        Color = assignment?.Shift?.strColor,
                        StartTime = assignment?.Shift?.tStartTime.ToString(@"hh\:mm"),
                        EndTime = assignment?.Shift?.tEndTime.ToString(@"hh\:mm")
                    });
                }
                
                rowData.Add(row);
            }

            return new ShiftPlannerViewDto
            {
                AvailableShifts = shifts,
                Rows = rowData
            };
        }

        public async Task AssignShiftAsync(ShiftAssignmentDto dto)
        {
            if (!DateOnly.TryParse(dto.Date, out var date))
            {
                throw new ArgumentException("Invalid date format. Expected YYYY-MM-DD.");
            }

            var existing = await _context.EmployeeShifts
                .FirstOrDefaultAsync(a => a.strUserGUID == dto.UserGuid && a.dtDate == date);

            if (existing != null)
            {
                if (dto.ShiftGuid == Guid.Empty)
                {
                    _context.EmployeeShifts.Remove(existing);
                }
                else
                {
                    existing.strShiftGUID = dto.ShiftGuid;
                    existing.strNotes = dto.Notes;
                    existing.dtUpdatedOn = DateTime.UtcNow;
                }
            }
            else if (dto.ShiftGuid != Guid.Empty)
            {
                var assignment = new EmployeeShift
                {
                    strUserGUID = dto.UserGuid,
                    strShiftGUID = dto.ShiftGuid,
                    dtDate = date,
                    strNotes = dto.Notes
                };
                _context.EmployeeShifts.Add(assignment);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<int> CopyWeekAsync(DateTime targetStartDate)
        {
            var targetStart = DateOnly.FromDateTime(targetStartDate);
            var targetEnd = targetStart.AddDays(6);

            var sourceStart = targetStart.AddDays(-7);
            var sourceEnd = targetStart.AddDays(-1);

            // 1. Clear target week assignments to prevent duplicates
            var existingInTarget = await _context.EmployeeShifts
                .Where(a => a.dtDate >= targetStart && a.dtDate <= targetEnd)
                .ToListAsync();

            if (existingInTarget.Any())
            {
                _context.EmployeeShifts.RemoveRange(existingInTarget);
            }

            // 2. Fetch source week assignments
            var sourceAssignments = await _context.EmployeeShifts
                .Where(a => a.dtDate >= sourceStart && a.dtDate <= sourceEnd)
                .ToListAsync();

            if (!sourceAssignments.Any()) return 0;

            // 3. Duplicate into target week
            var newAssignments = sourceAssignments.Select(a => new EmployeeShift
            {
                strUserGUID = a.strUserGUID,
                strShiftGUID = a.strShiftGUID,
                dtDate = a.dtDate.AddDays(7),
                strNotes = a.strNotes,
                dtCreatedOn = DateTime.UtcNow,
                dtUpdatedOn = DateTime.UtcNow
            }).ToList();

            _context.EmployeeShifts.AddRange(newAssignments);
            await _context.SaveChangesAsync();

            return newAssignments.Count;
        }
    }
}

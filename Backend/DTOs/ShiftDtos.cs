using System;
using System.Collections.Generic;

namespace Backend.DTOs
{
    public class ShiftDto
    {
        public Guid ShiftGuid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class CreateShiftDto
    {
        public string Name { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class ShiftAssignmentDto
    {
        public Guid UserGuid { get; set; }
        public Guid ShiftGuid { get; set; }
        public string Date { get; set; } = string.Empty; // ISO Date YYYY-MM-DD
        public string Notes { get; set; } = string.Empty;
    }

    public class ShiftPlannerViewDto
    {
        public List<ShiftDto> AvailableShifts { get; set; } = new();
        public List<EmployeeShiftGridRowDto> Rows { get; set; } = new();
    }

    public class EmployeeShiftGridRowDto
    {
        public Guid UserGuid { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public List<EmployeeShiftCellDto> Days { get; set; } = new();
    }

    public class EmployeeShiftCellDto
    {
        public string Date { get; set; } = string.Empty;
        public Guid? ShiftGuid { get; set; }
        public string? ShiftName { get; set; }
        public string? Color { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
    }
}

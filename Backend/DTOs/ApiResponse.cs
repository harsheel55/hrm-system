using System;

namespace Backend.DTOs
{
    /// <summary>
    /// Standard API response wrapper to ensure consistent response format:
    /// { statusCode, message, data }
    /// </summary>
    /// <typeparam name="T">Payload type for the data property</typeparam>
    public class ApiResponse<T>
    {
        public int statusCode { get; set; }
        public string message { get; set; } = string.Empty;
        public T? data { get; set; }
    }
}


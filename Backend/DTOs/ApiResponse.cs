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

        public ApiResponse()
        {
        }

        public ApiResponse(int statusCode, string message)
        {
            this.statusCode = statusCode;
            this.message = message;
        }

        public ApiResponse(int statusCode, string message, T? data)
        {
            this.statusCode = statusCode;
            this.message = message;
            this.data = data;
        }
    }
}


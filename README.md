# HNG Internship - Backend Stage 0 Task

## 📋 Description

This is a REST API that integrates with the [Genderize.io API](https://genderize.io) to predict the gender of a given name. The endpoint processes the external API response and returns a structured JSON response with additional computed fields (`is_confident` and `processed_at`).

## 🚀 API Endpoint

### GET /api/classify

Classify a name to predict its gender.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | The first name to classify |

**Example Request:**
GET /api/classify?name=john

## 📤 Response Formats

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-13T10:30:00Z"
  }
}

Error Responses
400 Bad Request - Missing or Empty Name
{
  "status": "error",
  "message": "Missing or empty name parameter"
}

422 Unprocessable Entity - Name Not a String
{
  "status": "error",
  "message": "name is not a string"
}

500 Internal Server Error - External API Failure
{
  "status": "error",
  "message": "Internal server error while calling external API"
}

502 Bad Gateway - External API Error
{
  "status": "error",
  "message": "External API returned an error"
}

504 Gateway Timeout - External API Timeout
{
  "status": "error",
  "message": "External API timeout"
}

Edge Case - No Prediction Available
When Genderize API returns gender: null or count: 0:
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
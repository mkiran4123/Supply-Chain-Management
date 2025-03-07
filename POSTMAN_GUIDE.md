# Postman Guide for Supply Chain Management API

## Error: "value is not a valid dict"

If you're seeing this error when trying to create a user:

```json
{
    "detail": [
        {
            "loc": [
                "body"
            ],
            "msg": "value is not a valid dict",
            "type": "type_error.dict"
        }
    ]
}
```

This typically means that your request body format is incorrect. Here's how to fix it:

## Creating a User in Postman

1. **Set the correct HTTP method and URL**:
   - Method: POST
   - URL: http://localhost:8000/users/

2. **Set the correct headers**:
   - Click on the "Headers" tab
   - Add a header with Key: `Content-Type` and Value: `application/json`

3. **Format your request body correctly**:
   - Click on the "Body" tab
   - Select "raw" and make sure "JSON" is selected from the dropdown
   - Enter your JSON data in the following format:

```json
{
    "email": "newuser@example.com",
    "full_name": "New User",
    "password": "securepassword123"
}
```

4. **Common mistakes to avoid**:
   - Don't wrap the JSON in extra quotes
   - Don't use single quotes instead of double quotes
   - Make sure all field names are spelled correctly
   - Ensure the JSON is properly formatted with no trailing commas
   - Don't send the data as form-data or x-www-form-urlencoded

## Example Screenshot

![Postman Setup](https://i.imgur.com/example.png)

*Note: This is a placeholder image reference. The actual image is not included.*

## Testing the Request

After setting up your request correctly, click "Send". If successful, you should receive a response like:

```json
{
  "email": "newuser@example.com",
  "full_name": "New User",
  "id": 2,
  "is_active": true
}
```

If you receive an error about the email already being registered, try using a different email address.
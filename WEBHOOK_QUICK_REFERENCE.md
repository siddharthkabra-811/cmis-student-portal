# n8n Webhook - Quick Reference

## Endpoint
**POST** `/api/webhook/n8n`

## Setup

1. Add to `.env.local`:
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

2. Restart Next.js server

## Frontend Call

```javascript
// Simple example
const response = await fetch('/api/webhook/n8n', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ student_id: 123 })
});

const data = await response.json();
console.log(data);
```

## Request Body
```json
{
  "student_id": 123
}
```

## Success Response
```json
{
  "success": true,
  "message": "n8n pipeline triggered successfully",
  "student_id": 123,
  "n8n_response": { ... }
}
```

## Error Response
```json
{
  "error": "Error message here"
}
```

See `N8N_WEBHOOK_SETUP.md` for complete documentation.


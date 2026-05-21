# InboxPilot Micro SaaS Frontend

Static frontend prototype for a Micro SaaS product that gives small social-commerce businesses a unified inbox, unanswered-message detection, and AI sales analytics.

Run it with Flask:

```bash
pip install -r requirements.txt
python app.py
```

Then open `http://127.0.0.1:5000`.

The sidebar sections are interactive inside the single-page frontend:

- Inbox
- Needs Attention
- Sales Insights
- Products
- Team
- Billing
- AI Summary modal

Flask routes included:

- `GET /`
- `GET /api/bootstrap`
- `GET /api/summary`
- `POST /api/conversations/<conversation_id>/reply`
- `POST /api/sales`

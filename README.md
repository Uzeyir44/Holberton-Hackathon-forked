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
- `GET /api/notifications`
- `POST /api/conversations/<conversation_id>/reply`
- `POST /api/conversations/<conversation_id>/priority`
- `POST /api/conversations/assign-urgent`
- `POST /api/sales`
- `POST /api/products`
- `POST /api/team/invite`
- `POST /api/team/<name>/permissions`
- `POST /api/billing/select`

When you use the frontend through Flask, backend actions are printed in the terminal with the prefix `[InboxPilot backend]`. Sending a chat reply also returns a sample incoming customer message so you can see two-way chat behavior.

Run backend/frontend contract tests:

```bash
python -m unittest discover -s tests
```

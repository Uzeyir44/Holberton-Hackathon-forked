import unittest
import warnings
from contextlib import redirect_stdout
from io import StringIO

from app import app


class FrontendBackendContractTest(unittest.TestCase):
    def setUp(self):
        warnings.simplefilter("ignore", ResourceWarning)
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_index_serves_frontend_shell_and_assets(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('id="app"', html)
        self.assertIn("./styles.css", html)
        self.assertIn("./script.js", html)

    def test_frontend_javascript_is_served_and_calls_backend_api(self):
        response = self.client.get("/script.js")

        self.assertEqual(response.status_code, 200)
        script = response.get_data(as_text=True)
        self.assertIn('fetch(apiUrl("/api/bootstrap")', script)
        self.assertIn('postJson("/api/sales"', script)
        self.assertIn('getJson("/api/summary"', script)
        self.assertIn('getJson("/api/notifications"', script)
        self.assertIn('window.location.protocol === "file:"', script)
        self.assertIn("/api/conversations/${selected.id}/reply", script)
        self.assertIn("replaceConversation(result.conversation)", script)
        self.assertIn("productModal()", script)
        self.assertIn("permissionsModal(result.member, result.permissions)", script)
        self.assertIn("updateCurrentPlanCard()", script)
        self.assertIn("updateMetrics(data.metrics)", script)
        self.assertIn("metrics.estimated_sales", script)
        self.assertIn("updateChannels(data.channels)", script)
        self.assertIn("updateChannelRows()", script)
        self.assertNotIn('showToast("Reply sent locally")', script)

    def test_backend_allows_development_cors_for_direct_file_frontend(self):
        response = self.client.get("/api/bootstrap")

        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "*")
        self.assertIn("POST", response.headers["Access-Control-Allow-Methods"])

    def test_stylesheet_is_served(self):
        response = self.client.get("/styles.css")

        self.assertEqual(response.status_code, 200)
        css = response.get_data(as_text=True)
        self.assertIn(".app-shell", css)
        self.assertIn(".pricing-grid", css)

    def test_bootstrap_endpoint_returns_frontend_data(self):
        response = self.client.get("/api/bootstrap")

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("conversations", data)
        self.assertIn("products", data)
        self.assertIn("team", data)
        self.assertIn("plans", data)
        self.assertIn("metrics", data)
        self.assertIn("channels", data)
        self.assertGreaterEqual(len(data["conversations"]), 1)
        self.assertIn("sale", data["conversations"][0])

    def test_channels_endpoint_returns_backend_owned_sidebar_counts(self):
        response = self.client.get("/api/channels")

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreaterEqual(len(data), 3)
        self.assertIn("name", data[0])
        self.assertIn("count", data[0])

    def test_metrics_endpoint_returns_backend_owned_cards(self):
        response = self.client.get("/api/metrics")

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("estimated_sales", data)
        self.assertIn("avg_reply_time", data)
        self.assertIn("urgent_count", data)
        self.assertIn("top_product", data)
        self.assertIn("active_subscribers", data)

    def test_backend_can_mutate_metric_cards(self):
        before = self.client.get("/api/metrics").get_json()
        after_response = self.client.post("/api/metrics/demo-update", json={})

        self.assertEqual(after_response.status_code, 200)
        after = after_response.get_json()
        self.assertGreater(after["estimated_sales"], before["estimated_sales"])
        self.assertGreater(after["backend_revision"], before["backend_revision"])
        self.assertIn("last_synced", after)

    def test_summary_endpoint_returns_ai_summary_data(self):
        response = self.client.get("/api/summary")

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["estimated_revenue"].endswith(" AZN"))
        self.assertTrue(data["most_requested"])
        self.assertIsInstance(data["needs_reply"], int)
        self.assertIn("recommendation", data)

    def test_frontend_can_post_reply_to_backend(self):
        response = self.client.post(
            "/api/conversations/1/reply",
            json={"text": "Yes, your order is reserved."},
        )

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["conversation_id"], 1)
        self.assertEqual(data["message"], ["outgoing", "Yes, your order is reserved."])
        self.assertEqual(data["auto_reply"][0], "incoming")
        self.assertEqual(data["status"], "Customer replied")
        self.assertTrue(data["backend_processed"])
        self.assertEqual(data["conversation"]["id"], 1)
        self.assertEqual(data["conversation"]["messages"][-1][0], "incoming")
        self.assertIn("Backend customer reply", data["conversation"]["messages"][-1][1])

    def test_reply_endpoint_rejects_empty_text(self):
        response = self.client.post("/api/conversations/1/reply", json={"text": "   "})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Reply text is required")

    def test_frontend_can_create_sale_record(self):
        sale = {"product": "Black hoodie", "quantity": 2, "revenue": 80}
        response = self.client.post("/api/sales", json=sale)

        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data["created"])
        self.assertEqual(data["sale"], sale)
        self.assertIn("metrics", data)

    def test_sale_endpoint_rejects_incomplete_payload(self):
        response = self.client.post("/api/sales", json={"product": "Black hoodie"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Product, quantity, and revenue are required")

    def test_backend_prints_when_processing_reply(self):
        output = StringIO()

        with redirect_stdout(output):
            response = self.client.post(
                "/api/conversations/1/reply",
                json={"text": "Backend print test"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertIn("[InboxPilot backend] processed reply", output.getvalue())
        self.assertIn("[InboxPilot backend] created sample customer reply", output.getvalue())

    def test_notifications_endpoint_returns_backend_message(self):
        response = self.client.get("/api/notifications")

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("message", data)
        self.assertIn("urgent_count", data)
        self.assertIn("low_stock", data)

    def test_assign_urgent_endpoint_returns_action_result(self):
        response = self.client.post("/api/conversations/assign-urgent", json={})

        self.assertEqual(response.status_code, 200)
        self.assertIn("assigned", response.get_json())

    def test_product_team_and_billing_action_endpoints(self):
        product_response = self.client.post(
            "/api/products",
            json={"name": "Cream cardigan", "requests": 9, "sales": 4, "revenue": 180, "stock": 12, "trend": "Manual"},
        )
        invite_response = self.client.post("/api/team/invite", json={})
        permissions_response = self.client.post("/api/team/Aysel/permissions", json={})
        billing_response = self.client.post("/api/billing/select", json={"plan": "Growth"})

        self.assertEqual(product_response.status_code, 201)
        self.assertTrue(product_response.get_json()["created"])
        self.assertEqual(product_response.get_json()["product"]["name"], "Cream cardigan")
        self.assertEqual(invite_response.status_code, 201)
        self.assertTrue(invite_response.get_json()["invited"])
        self.assertEqual(permissions_response.status_code, 200)
        self.assertIn("permissions", permissions_response.get_json())
        self.assertEqual(billing_response.status_code, 200)
        self.assertTrue(billing_response.get_json()["selected"])
        self.assertIn("plans", billing_response.get_json())


if __name__ == "__main__":
    unittest.main()

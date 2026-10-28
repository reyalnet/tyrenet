from types import SimpleNamespace

import frappe

from tyrenet.tyrenet.doctype.tyre_size.tyre_size import get_brands_html


def test_stock_links_use_v16_desk_routes(monkeypatch):
	monkeypatch.setattr(
		frappe,
		"db",
		SimpleNamespace(
			sql=lambda *args, **kwargs: [
				{"item_name": "TYRE A", "brand": "Brand", "warehouse": "Stores", "qty": 2}
			]
		),
	)
	monkeypatch.setattr(frappe.local, "conf", frappe._dict(host_name="https://v16.local"), raising=False)
	html = get_brands_html("A")
	assert "/desk/item/TYRE%20A" in html
	assert "/app/item/" not in html

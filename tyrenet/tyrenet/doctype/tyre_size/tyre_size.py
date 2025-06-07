# Copyright (c) 2025, Cubenet and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
from urllib.parse import quote
from frappe.utils import escape_html

class TyreSize(Document):
	pass
import frappe
from frappe import _

@frappe.whitelist()
def get_brands_html(tyre_size):
    if not tyre_size:
        return "<p>Invalid tyre size.</p>"

    data = frappe.db.sql("""
        SELECT 
            i.name AS item_name,
            i.brand,
            b.warehouse,
            SUM(b.actual_qty) AS qty
        FROM `tabItem` i
        JOIN `tabBin` b ON i.name = b.item_code
        WHERE i.custom_tyre_size = %s
        GROUP BY i.name, i.brand, b.warehouse
    """, (tyre_size,), as_dict=True)

    if not data:
        return "<p>No quantity available for this size.</p>"

    item_map = {}
    warehouses = set()

    for row in data:
        if row["qty"] <= 0:  # 🛑 SKIP items with 0 qty
            continue

        key = row["item_name"]
        if key not in item_map:
            item_map[key] = {"brand": row["brand"], "warehouses": {}}
        item_map[key]["warehouses"][row["warehouse"]] = row["qty"]
        warehouses.add(row["warehouse"])

    if not item_map:
        return "<p>No stock available above 0 for this tyre size.</p>"

    warehouse_list = sorted(warehouses)
    html = '''
    <h5>Available Items</h5>
    <div style="max-width: 100%; overflow-x: auto;">
    <table class="table table-bordered" style="width: 100%; table-layout: auto; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="width: 100%; white-space: nowrap; text-align: left;">Item</th>'''

    for wh in warehouse_list:
        html += f'<th style="white-space: nowrap; text-align: center;">{wh}</th>'

    html += '</tr></thead><tbody>'

    for item_name, item_data in item_map.items():
        item_url = f"/app/item/{quote(item_name)}"
        html += f'''
        <tr>
            <td style="width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <a href="{item_url}" target="_blank" style="text-decoration: none;">{escape_html(item_name)}</a>
            </td>'''

        for wh in warehouse_list:
            qty = item_data["warehouses"].get(wh, "")
            html += f'<td style="white-space: nowrap; text-align: center;">{qty}</td>'
        html += '</tr>'

    html += '</tbody></table></div>'
    return html

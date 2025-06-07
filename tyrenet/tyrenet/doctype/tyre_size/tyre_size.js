// Copyright (c) 2025, Cubenet and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tyre Size', {
    refresh: function(frm) {
        if (!frm.doc.name) return;

        // 🔁 Load available brands table
        frappe.call({
            method: 'tyrenet.tyrenet.doctype.tyre_size.tyre_size.get_brands_html',
            args: { tyre_size: frm.doc.name },
            callback: function(r) {
                frm.fields_dict.available_brands_html.$wrapper.html(r.message || "<p>Error loading brands.</p>");
            }
        });

        // ➕ Add button to link matching items
        if (!frm.is_new()) {
            frm.add_custom_button('Link Tyre(s)', () => {
                frappe.call({
                    method: 'tyrenet.tyrenet.doctype.tyre_size.tyre_size.link_matching_items',
                    args: {
                        tyre_size: frm.doc.name
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.msgprint(r.message);
                            // optional: reload the form if you want to see updated data
                            frm.reload_doc();
                        } else {
                            frappe.msgprint("No response from server");
                        }
                    }
                });
            });
        }
    }
});

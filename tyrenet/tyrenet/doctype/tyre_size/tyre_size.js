// Copyright (c) 2025, Cubenet and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tyre Size', {
    refresh: function(frm) {
        if (!frm.doc.name) return;

        frappe.call({
            method: 'tyrenet.tyrenet.doctype.tyre_size.tyre_size.get_brands_html',
            args: { tyre_size: frm.doc.name },
            callback: function(r) {
                frm.fields_dict.available_brands_html.$wrapper.html(r.message || "<p>Error loading brands.</p>");
            }
        });
    }
});

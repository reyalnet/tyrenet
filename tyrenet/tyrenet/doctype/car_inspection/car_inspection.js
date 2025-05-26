// Copyright (c) 2025, Cubenet and contributors
// For license information, please see license.txt

frappe.ui.form.on('Car Inspection', {
    onload: function (frm) {
        // Set today's date if not already set
        if (!frm.doc.inspection_date) {
            frm.set_value('inspection_date', frappe.datetime.get_today());
        }

        // Set inspector based on logged-in user
        if (!frm.doc.inspector) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Employee",  // Use "Personnel" if renamed
                    filters: {
                        user_id: frappe.session.user
                    },
                    fields: ["name"]
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {
                        frm.set_value("inspector", r.message[0].name);
                    }
                }
            });
        }

        // Fill 5 rows in tyre_inspection_detail if empty
        const tyre_positions = ['Front Right', 'Front Left', 'Rear Right', 'Rear Left', 'Spare'];
        if (!frm.doc.tyre_inspection_detail || frm.doc.tyre_inspection_detail.length === 0) {
            tyre_positions.forEach(pos => {
                let row = frm.add_child('tyre_inspection_detail');
                row.tyre_position = pos;
            });
            frm.refresh_field('tyre_inspection_detail');
        }

        // Fill 4 rows in brake_inspection_detail if empty
        const brake_positions = ['Front Right', 'Front Left', 'Rear Right', 'Rear Left'];
        if (!frm.doc.brake_inspection_detail || frm.doc.brake_inspection_detail.length === 0) {
            brake_positions.forEach(pos => {
                let row = frm.add_child('brake_inspection_detail');
                row.brake_position = pos;
            });
            frm.refresh_field('brake_inspection_detail');
        }
    },

    registration_number: function (frm) {
        if (frm.doc.registration_number) {
            frm.set_value('registration_number', frm.doc.registration_number.toUpperCase());
        }
    },

    validate: function (frm) {
        if (frm.doc.registration_number) {
            frm.set_value('registration_number', frm.doc.registration_number.toUpperCase());
        }

        // Strip commas before save
        if (frm.doc.mileage) {
            frm.set_value('mileage', frm.doc.mileage.toString().replace(/,/g, ''));
        }
    },

    onload_post_render: function(frm) {
        format_mileage_display(frm);
    },

    mileage: function(frm) {
        format_mileage_display(frm);
    }
});

function format_mileage_display(frm) {
    if (frm.doc.mileage) {
        const raw = frm.doc.mileage.toString().replace(/,/g, '');
        const formatted = new Intl.NumberFormat().format(Number(raw));
        frm.fields_dict.mileage.$wrapper.find('input').val(formatted);
    }
}

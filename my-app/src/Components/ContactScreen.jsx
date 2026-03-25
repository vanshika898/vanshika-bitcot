import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  CirclePlus,
  Pencil,
  Trash2,
  Eye,
  CircleUser,
  Search,
} from "lucide-react";

// ✅ FIX: Add ID here
const normalizeContact = (c) => ({
  id: c.id || crypto.randomUUID(),
  name: c.name?.trim() || "Unnamed",
  email: c.email?.trim() || "no-reply@example.com",
  mobile: c.mobile?.trim() || "N/A",
  address: c.address?.trim() || "Antartika",
});

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  // Load data
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/BitcotDev/fresher-machin-test/main/json/sample.json",
    )
      .then((res) => res.json())
      .then((data) => {
        const saved = localStorage.getItem("contacts");
        const source =
          saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : data;

        // ✅ Normalize with ID
        setContacts((source || []).map(normalizeContact));
      })
      .catch((err) => console.log(err));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Toast auto hide
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", mobile: "", address: "" });
    setEditingContact(null);
    setViewingContact(null);
    setIsViewing(false);
    setErrors({});
  };

  // ✅ DELETE FIX (works because id exists now)
  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setMessage("Contact deleted successfully!");
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsViewing(false);
    setForm(contact);
    setErrors({});
    setOpenDialog(true);
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
    setIsViewing(true);
    setForm(contact);
    setErrors({});
    setOpenDialog(true);
  };

  const handleSaveContact = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required!";
    if (!form.email.trim()) newErrors.email = "Email is required!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email!";
    else {
      const emailExists = contacts.some(
        (c) =>
          c.email.toLowerCase() === form.email.toLowerCase() &&
          c.id !== editingContact?.id,
      );
      if (emailExists) newErrors.email = "Email already exists!";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const contactToSave = normalizeContact({
      ...form,
      id: editingContact?.id || crypto.randomUUID(),
    });

    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? contactToSave : c)),
      );
      setMessage("✅ Contact updated!");
    } else {
      setContacts((prev) => [...prev, contactToSave]);
      setMessage("✅ Contact added!");
    }

    resetForm();
    setOpenDialog(false);
    setSearch("");
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const viewData = viewingContact || form;

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center">
      {message && (
        <div className="fixed top-5 right-5 bg-white border border-blue-200 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <Card className="w-full max-w-3xl shadow-2xl border border-blue-100">
        <CardContent>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Contacts</h1>
              <p className="text-sm text-slate-500">
                {contacts.length} saved contact
                {contacts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
            >
              <CirclePlus className="mr-2" size={16} />
              New
            </Button>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or email"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-3 max-h-[450px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center text-gray-500 p-8 border border-dashed rounded">
                No contacts found
              </div>
            ) : (
              filteredContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center p-4 rounded-lg border bg-white hover:shadow transition"
                >
                  <div className="flex items-center gap-3">
                    <CircleUser size={34} className="text-blue-500" />
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                      <p className="text-sm text-gray-500">{c.mobile}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleViewContact(c)}>
                      <Eye className="text-blue-500" size={18} />
                    </button>
                    <button onClick={() => handleEditContact(c)}>
                      <Pencil className="text-green-500" size={18} />
                    </button>
                    <button onClick={() => handleDeleteContact(c.id)}>
                      <Trash2 className="text-red-500" size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isViewing
                ? "Contact Details"
                : editingContact
                  ? "Edit Contact"
                  : "Add Contact"}
            </DialogTitle>
            <DialogDescription>
              {isViewing ? "Contact information" : "Fill details below"}
            </DialogDescription>
          </DialogHeader>

          {isViewing ? (
            <div className="bg-slate-100 p-4 rounded-lg border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-semibold">Name:</span>
                <span>{viewData.name}</span>

                <span className="font-semibold">Email:</span>
                <span>{viewData.email}</span>

                <span className="font-semibold">Phone:</span>
                <span>{viewData.mobile}</span>

                <span className="font-semibold">Address:</span>
                <span>{viewData.address}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <Input
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
              />

              <Input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            {isViewing ? (
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSaveContact}>
                  {editingContact ? "Update" : "Save"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactScreen;

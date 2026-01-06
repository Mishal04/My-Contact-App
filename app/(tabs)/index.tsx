import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// --- TypeScript type for a contact ---
type Contact = {
  id: string;
  name: string;
  phone: string;
  isFavorite?: boolean;
};

export default function Index() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const contactsCol = collection(db, 'contacts');

  // Load contacts
  const loadContacts = async () => {
    const snapshot = await getDocs(contactsCol);
    const data: Contact[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Contact[];

    data.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    setContacts(data);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      await loadContacts();
    };
    fetchContacts();
  }, []);

  // Add or update
  const handleAddOrUpdate = async () => { 
    if (!name || !phone) return;

    if (editingId) {
      const docRef = doc(db, 'contacts', editingId);
      await updateDoc(docRef, { name, phone });
      setEditingId(null);
    } else {
      await addDoc(contactsCol, { name, phone, isFavorite: false });
    }

    setName('');
    setPhone('');
    loadContacts();
  };

  // Edit contact
  const handleEdit = (contact: Contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEditingId(contact.id);
  };

  // Delete contact
  const handleDelete = async (id: string) => {
    const docRef = doc(db, 'contacts', id);
    await deleteDoc(docRef);
    loadContacts();
  };

  // Toggle favorite
  const toggleFavorite = async (contact: Contact) => {
    const docRef = doc(db, 'contacts', contact.id);
    await updateDoc(docRef, { isFavorite: !contact.isFavorite });
    loadContacts();
  };

  // Filter by search
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      <TextInput
        placeholder="Search by name or phone"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        onPress={handleAddOrUpdate}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>
          {editingId ? 'Update Contact' : 'Add Contact'}
        </Text>
      </TouchableOpacity>

      <FlatList
        style={styles.list}
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.contactRow}>
              <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Text style={styles.favorite}>
                  {item.isFavorite ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={[styles.button, styles.editButton]}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// --- Styles ---
// --- Dark Theme Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // light text
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  contactItem: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  contactPhone: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 3,
  },
  favorite: {
    fontSize: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    marginRight: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


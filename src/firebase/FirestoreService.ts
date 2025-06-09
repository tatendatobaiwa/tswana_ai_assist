import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: any; // Use serverTimestamp() for new messages
  audioUrl?: string; // Optional for AI responses or user voice input
}

// Function to start a new conversation
export const startNewConversation = async (userId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'conversations'), {
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Function to add a message to a conversation
export const addMessageToConversation = async (conversationId: string, message: Message) => {
  try {
    const messagesCollectionRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesCollectionRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    // Update the conversation's updatedAt timestamp
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding message: ", e);
    throw e;
  }
};

// Function to listen for messages in a conversation (real-time updates)
export const listenToMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
  const messagesCollectionRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesCollectionRef, orderBy('timestamp'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data() as Message);
    });
    callback(messages);
  }, (error) => {
    console.error("Error listening to messages: ", error);
  });

  return unsubscribe; // Return unsubscribe function to clean up listener
};

// Function to get a specific conversation (e.g., to load previous conversations)
export const getConversation = async (conversationId: string) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    if (conversationSnap.exists()) {
      return conversationSnap.data();
    } else {
      console.log("No such conversation!");
      return null;
    }
  } catch (e) {
    console.error("Error getting conversation: ", e);
    throw e;
  }
}; 
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App and services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: Must specify firestoreDatabaseId */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure as mandated by guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation helper check on startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Authentication Primitives
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Auth failed:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Signout failed:", error);
  }
}

// --- Dynamic CRUD Builders (Type-Safe and Error-Wrapped) ---

export async function getAllDocuments<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(d => ({ ...d.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    return [];
  }
}

export async function createDocument<T extends { id: string }>(collectionName: string, data: T): Promise<void> {
  const path = `${collectionName}/${data.id}`;
  try {
    await setDoc(doc(db, collectionName, data.id), data as any);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateDocument<T extends { id: string }>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  const path = `${collectionName}/${id}`;
  try {
    await updateDoc(doc(db, collectionName, id), data as any);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const path = `${collectionName}/${id}`;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

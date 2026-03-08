import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { firebaseConfig } from './config';

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey);

let firebaseApp = null;

if (hasFirebaseConfig) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = firebaseApp ? getAuth(firebaseApp) : null;

const canUseWindow = typeof window !== 'undefined';

export const db: Firestore | null = firebaseApp
  ? canUseWindow
    ? initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    : getFirestore(firebaseApp)
  : null;

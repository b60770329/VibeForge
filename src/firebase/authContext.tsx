import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './config';
import { CourseApplication, MvpGeneratedProject, SavedModuleItem } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  applications: CourseApplication[];
  savedModuleIds: number[];
  savedProjects: MvpGeneratedProject[];
  toggleSaveModule: (moduleId: number) => Promise<void>;
  submitApplication: (data: { name: string; email: string; track: string; comment?: string }) => Promise<string>;
  saveMvpProject: (project: MvpGeneratedProject) => Promise<string>;
  deleteMvpProject: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [savedModuleRecords, setSavedModuleRecords] = useState<SavedModuleItem[]>([]);
  const [savedProjects, setSavedProjects] = useState<MvpGeneratedProject[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Upsert user profile
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error('Error syncing user profile:', error);
        }
      } else {
        setApplications([]);
        setSavedModuleRecords([]);
        setSavedProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to user's course applications
  useEffect(() => {
    if (!user) return;

    const path = 'applications';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const apps: CourseApplication[] = [];
        snapshot.forEach((docSnap) => {
          apps.push(docSnap.data() as CourseApplication);
        });
        setApplications(apps);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to user's saved modules
  useEffect(() => {
    if (!user) return;

    const path = 'saved_modules';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const modules: SavedModuleItem[] = [];
        snapshot.forEach((docSnap) => {
          modules.push(docSnap.data() as SavedModuleItem);
        });
        setSavedModuleRecords(modules);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to user's saved MVP projects
  useEffect(() => {
    if (!user) return;

    const path = 'mvp_projects';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects: MvpGeneratedProject[] = [];
        snapshot.forEach((docSnap) => {
          projects.push(docSnap.data() as MvpGeneratedProject);
        });
        setSavedProjects(projects);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  const savedModuleIds = useMemo(() => {
    return savedModuleRecords.map((item) => item.moduleId);
  }, [savedModuleRecords]);

  const toggleSaveModule = async (moduleId: number) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    const existingRecord = savedModuleRecords.find((item) => item.moduleId === moduleId);
    const path = 'saved_modules';

    try {
      if (existingRecord) {
        await deleteDoc(doc(db, path, existingRecord.id));
      } else {
        const docId = `${user.uid}_mod_${moduleId}`;
        const newRecord: SavedModuleItem = {
          id: docId,
          userId: user.uid,
          moduleId,
          savedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, path, docId), newRecord);
      }
    } catch (error) {
      handleFirestoreError(error, existingRecord ? OperationType.DELETE : OperationType.CREATE, path);
    }
  };

  const submitApplication = async (data: { name: string; email: string; track: string; comment?: string }) => {
    if (!user) {
      throw new Error('Необходимо войти через Google для отправки заявки');
    }

    const path = 'applications';
    const appId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newApp: CourseApplication = {
      id: appId,
      userId: user.uid,
      name: data.name.trim(),
      email: data.email.trim(),
      track: data.track,
      comment: data.comment ? data.comment.trim() : '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, path, appId), newApp);
      return appId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const saveMvpProject = async (project: MvpGeneratedProject) => {
    if (!user) {
      throw new Error('Войдите через Google, чтобы сохранить проект');
    }

    const path = 'mvp_projects';
    const projectId = project.id || `prj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const projectRecord: MvpGeneratedProject = {
      ...project,
      id: projectId,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, path, projectId), projectRecord);
      return projectId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteMvpProject = async (id: string) => {
    if (!user) return;
    const path = 'mvp_projects';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        applications,
        savedModuleIds,
        savedProjects,
        toggleSaveModule,
        submitApplication,
        saveMvpProject,
        deleteMvpProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const mockFirebaseApp = {
  name: '[DEFAULT]',
  options: {},
};

export const mockFirebaseAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
  createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword'),
  signOut: jasmine.createSpy('signOut'),
  sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.callFake(() => Promise.resolve()), // Simula éxito
};

export const mockFirebaseFirestore = {
  collection: jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      set: jasmine.createSpy('set'),
      get: jasmine.createSpy('get'),
      delete: jasmine.createSpy('delete'),
    }),
  }),
};

export const mockFirebase = {
  initializeApp: jasmine.createSpy('initializeApp').and.returnValue(mockFirebaseApp),
};


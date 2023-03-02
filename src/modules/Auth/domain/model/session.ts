const storageSessionKey = 'session';

export default class Session {
  access!: SessionAccess;
  user!: SessionUser;

  constructor(init?: SessionProps) {
    this.init(init);
  }
  init(init?: SessionProps) {
    this.access = {
      expire_in: init?.access?.expire_in || '',
      token: init?.access?.token || '',
    };
    this.user = {
      name: init?.user?.name || '',
    };
  }

  isValid(): boolean {
    const expiration = new Date(this.access.expire_in);
    const today = new Date();
    return expiration.getTime() > today.getTime();
  }

  store() {
    localStorage.setItem(storageSessionKey, JSON.stringify(this));
  }
  flush() {
    this.init();
    this.store();
  }

  static loadFromStorage(): Session|null {
    const rawData = localStorage.getItem(storageSessionKey);
    return rawData!==null ? new Session(JSON.parse(rawData)) : null;
  }
}

export interface SessionProps {
  access: SessionAccess
  user: SessionUser
}
export interface SessionUser {
  name: string
};
export interface SessionAccess {
  expire_in: string
  token: string
};
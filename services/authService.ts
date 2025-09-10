
import type { User } from '../types';

class AuthService {
  // Simulates a database of users stored in localStorage
  private async getUsersDB(): Promise<Record<string, User>> {
    return JSON.parse(localStorage.getItem('cropAdvisor_users_db') || '{}');
  }

  private async saveUsersDB(db: Record<string, User>): Promise<void> {
    localStorage.setItem('cropAdvisor_users_db', JSON.stringify(db));
  }

  async register(
    userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>
  ): Promise<User> {
    const db = await this.getUsersDB();
    if (db[userData.phone]) {
      throw new Error('This phone number is already registered.');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      ...userData,
      isVerified: true, // Auto-verify in this mock service
      createdAt: new Date().toISOString(),
    };

    db[newUser.phone] = newUser;
    await this.saveUsersDB(db);

    // Automatically log in the user after registration
    localStorage.setItem('cropAdvisor_user', JSON.stringify(newUser));
    return newUser;
  }

  async login(phone: string, password: string): Promise<User> {
    const db = await this.getUsersDB();
    const user = db[phone];

    if (user && user.password === password) {
      localStorage.setItem('cropAdvisor_user', JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid phone number or password.');
  }

  logout(): void {
    localStorage.removeItem('cropAdvisor_user');
  }
}

export default new AuthService();

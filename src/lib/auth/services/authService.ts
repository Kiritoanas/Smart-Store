import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

export interface AuthError {
  message: string;
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'customer'
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getErrorMessage(authError));
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getErrorMessage(authError));
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any persisted auth state
    localStorage.removeItem('notifications-store');
    localStorage.removeItem('shopping-cart');
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getErrorMessage(authError));
  }
}

function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    case 'User already registered':
      return 'هذا البريد الإلكتروني مسجل بالفعل';
    case 'Password should be at least 6 characters':
      return 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
    case 'Invalid email':
      return 'البريد الإلكتروني غير صالح';
    default:
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
  }
}
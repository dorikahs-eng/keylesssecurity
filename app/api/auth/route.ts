import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, firstName, lastName } = await req.json();
    const supabase = getServiceClient();

    if (action === 'register') {
      // Check if user exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existing) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists.' });
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password, // In production use bcrypt — this is simplified
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('users').insert(newUser);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, firstName: newUser.first_name, lastName: newUser.last_name },
      });
    }

    if (action === 'login') {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('password', password)
        .single();

      if (error || !user) {
        return NextResponse.json({ success: false, error: 'Invalid email or password.' });
      }

      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' });
  } catch (error: any) {
    console.error('[auth]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

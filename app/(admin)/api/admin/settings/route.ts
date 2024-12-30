import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Get current settings
    const [currentSettings] = await db
      .select()
      .from(settings)
      .limit(1);

    // Return default settings if none exist
    if (!currentSettings) {
      return Response.json({
        maxMessagesPerChat: 50,
        maxChatsPerUser: 10,
        maxMessageLength: 2000,
        allowNewUsers: true,
        requireEmailVerification: true,
        maintenanceMode: false,
        systemPrompt: '',
      });
    }

    return Response.json(currentSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const newSettings = await request.json();

    // Get current settings
    const [currentSettings] = await db
      .select()
      .from(settings)
      .limit(1);

    if (currentSettings) {
      // Update existing settings
      await db
        .update(settings)
        .set(newSettings)
        .where(eq(settings.id, currentSettings.id));
    } else {
      // Create new settings
      await db.insert(settings).values(newSettings);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
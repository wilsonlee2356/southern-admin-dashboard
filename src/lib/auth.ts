import { getSession, signOut } from 'next-auth/react';

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    console.log('Attempting to refresh access token with refreshToken:', refreshToken);
    const response = await fetch('http://localhost:8080/api/ldap/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    const data = await response.json();
    console.log('Refresh Response:', data, 'Status:', response.status);

    if (!response.ok) {
      console.error('Refresh Failed:', data);
      throw new Error(data.message || 'Failed to refresh token');
    }

    return data.accessToken;
  } catch (err) {
    console.error('Refresh Error:', err);
    return null;
  }
}

export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const session = await getSession();
  if (!session?.accessToken) {
    console.error('No access token available');
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: 'include',
    });

    if (response.status === 401 && session.refreshToken) {
      console.log('Access token expired, attempting refresh');
      const newAccessToken = await refreshAccessToken(session.refreshToken);
      if (newAccessToken) {
        // Update session with new access token
        // Note: This is a simplified approach; you may need to update the session properly
        const updatedResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: 'include',
        });
        return updatedResponse;
      } else {
        console.error('Failed to refresh token, signing out');
        await signOut({ callbackUrl: '/auth/signin' });
        return null;
      }
    }

    return response;
  } catch (err) {
    console.error('Request Error:', err);
    return null;
  }
}
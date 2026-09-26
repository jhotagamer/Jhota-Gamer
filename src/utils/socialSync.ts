import { SocialMedia, BioData } from '../types';

export interface SyncResult {
  socials: SocialMedia[];
  discordPresence?: number;
  serverName?: string;
  syncedAt: string;
  statusMessage: string;
}

export const DISCORD_GUILD_ID = '1549835537160867923';
export const YOUTUBE_CHANNEL_HANDLE = '@JhotaGamerOficial';
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@JhotaGamerOficial';

// Normaliza links dos perfis e consulta somente a presença do Discord.
export async function syncSocialMetrics(
  currentSocials: SocialMedia[],
  currentBio?: BioData
): Promise<SyncResult> {
  const updatedSocials = currentSocials.filter((s) => s.platform !== 'tiktok').map(s => ({ ...s, followers: '' }));
  let discordPresence: number | undefined;
  let serverName: string | undefined;
  let hasDiscordSync = false;

  // 1. YouTube Channel Sync (@JhotaGamerOficial)
  const ytIdx = updatedSocials.findIndex((s) => s.platform === 'youtube');
  if (ytIdx !== -1) {
    const cur = updatedSocials[ytIdx];
    updatedSocials[ytIdx] = {
      ...cur,
      name: 'YouTube',
      username: '@JhotaGamerOficial',
      url: YOUTUBE_CHANNEL_URL,
      followers: ''
    };
  }

  // 2. Live Discord Synchronization via Widget JSON API
  try {
    const discordRes = await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`,
      {
        headers: {
          Accept: 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (discordRes.ok) {
      const data = await discordRes.json();
      if (Number.isInteger(data.presence_count) && data.presence_count >= 0) {
        discordPresence = data.presence_count;
        serverName = data.name;
        hasDiscordSync = true;

        const discordIdx = updatedSocials.findIndex((s) => s.platform === 'discord');
        if (discordIdx !== -1) {
          const onlineCount = data.presence_count;
          const displayFollowers = `${onlineCount} pessoas online`;

          updatedSocials[discordIdx] = {
            ...updatedSocials[discordIdx],
            followers: displayFollowers,
            url: 'https://discord.gg/Uq9pnCwDkq',
            username: 'discord.gg/Uq9pnCwDkq',
            name: data.name || updatedSocials[discordIdx].name
          };
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch live Discord widget data directly, metrics unavailable.', err);
  }

  // 3. Instagram Sync (@jhotagameroficial)
  const instagramIdx = updatedSocials.findIndex((s) => s.platform === 'instagram');
  if (instagramIdx !== -1) {
    const current = updatedSocials[instagramIdx];
    updatedSocials[instagramIdx] = {
      ...current,
      url: 'https://www.instagram.com/jhotagameroficial/',
      username: '@jhotagameroficial',
      followers: ''
    };
  }

  // 4. Facebook Sync (profile 61594432231685)
  const facebookIdx = updatedSocials.findIndex((s) => s.platform === 'facebook');
  if (facebookIdx !== -1) {
    const current = updatedSocials[facebookIdx];
    updatedSocials[facebookIdx] = {
      ...current,
      url: 'https://www.facebook.com/profile.php?id=61594432231685',
      username: 'facebook.com/profile.php?id=61594432231685',
      followers: ''
    };
  }

  // 5. Twitch Sync (twitch.tv/jhotagameroficial)
  const twitchIdx = updatedSocials.findIndex((s) => s.platform === 'twitch');
  if (twitchIdx !== -1) {
    const current = updatedSocials[twitchIdx];
    updatedSocials[twitchIdx] = {
      ...current,
      url: 'https://www.twitch.tv/jhotagameroficial',
      username: 'twitch.tv/jhotagameroficial',
      followers: ''
    };
  }

  // 6. Update Bio stats if provided
  if (currentBio) {
    try {
      const yt = updatedSocials.find((s) => s.platform === 'youtube');
      const dc = updatedSocials.find((s) => s.platform === 'discord');
      const updatedBio: BioData = {
        ...currentBio,
        stats: {
          ...currentBio.stats,
          subscribers: '',
          videos: '',
          guildMembers: dc?.followers || ''
        }
      };
      localStorage.setItem('jhota_bio', JSON.stringify(updatedBio));
    } catch {
      // ignore
    }
  }

  // 7. Format / normalize synchronized timestamp
  const now = new Date();
  const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const statusMessage = hasDiscordSync
    ? `Discord: ${discordPresence} pessoas online. Consulta às ${timeString}.`
    : 'Não foi possível consultar as pessoas online no Discord.';

  // Persist synced data to localStorage
  try {
    localStorage.setItem('jhota_socials', JSON.stringify(updatedSocials));
    if (hasDiscordSync) localStorage.setItem('jhota_social_last_sync', now.toISOString());
    else localStorage.removeItem('jhota_social_last_sync');
    localStorage.setItem('jhota_social_sync_message', statusMessage);
  } catch {
    // Ignore storage errors
  }

  return {
    socials: updatedSocials,
    discordPresence,
    serverName,
    syncedAt: now.toISOString(),
    statusMessage
  };
}

export function getLastSyncInfo(): { lastSyncTime: string; isRecent: boolean } {
  try {
    const raw = localStorage.getItem('jhota_social_last_sync');
    if (!raw) return { lastSyncTime: 'Pendente', isRecent: false };

    const date = new Date(raw);
    if (isNaN(date.getTime())) return { lastSyncTime: 'Pendente', isRecent: false };

    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) {
      return { lastSyncTime: 'Agora mesmo', isRecent: true };
    } else if (diffMinutes < 60) {
      return { lastSyncTime: `Há ${diffMinutes} min`, isRecent: true };
    } else {
      return {
        lastSyncTime: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isRecent: diffMinutes < 120
      };
    }
  } catch {
    return { lastSyncTime: 'Pendente', isRecent: false };
  }
}

import React from 'react';

export function ShareButtons({
  title = 'PM Sweat - Athlete Badge System',
  description = 'Gamify your athlete journey',
  url = 'https://pm-sweat.vercel.app',
}) {
  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`${title}: ${description}`);

  const socials = [
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      label: '𝕏',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      label: 'f',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      label: 'in',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      label: '✈',
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${shareText}`,
      label: '✉',
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {socials.map(social => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${social.name}`}
          title={`Share on ${social.name}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            background: 'var(--indigo)',
            color: 'white',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--signal)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--indigo)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}

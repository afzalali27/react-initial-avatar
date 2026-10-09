// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar on the server', () => {
  it('runs without a DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  it('renders initials, class and role to HTML', () => {
    const html = renderToString(<Avatar name="Server Side" />);
    expect(html).toContain('SS');
    expect(html).toContain('react-initial-avatar');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Server Side"');
  });

  it('renders the image markup when src is given', () => {
    const html = renderToString(<Avatar name="Jane Doe" src="https://example.com/a.png" />);
    expect(html).toContain('<img');
    expect(html).toContain('alt="Jane Doe"');
  });

  it('tolerates a null name on the server too', () => {
    expect(() => renderToString(<Avatar name={null as unknown as string} />)).not.toThrow();
  });
});

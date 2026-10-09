import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar';
import { pickColor } from './colors';

describe('Avatar', () => {
  describe('initials', () => {
    it('renders initials from name with role img and an aria-label', () => {
      render(<Avatar name="Elizabeth Smith Brown" />);
      const root = screen.getByRole('img', { name: 'Elizabeth Smith Brown' });
      expect(root.tagName).toBe('SPAN');
      expect(root).toHaveTextContent('ES');
      expect(root).toHaveClass('react-initial-avatar');
    });

    it('renders the initials prop verbatim', () => {
      render(<Avatar name="Jane Doe" initials="jd" />);
      expect(screen.getByRole('img')).toHaveTextContent('jd');
    });

    it('honours maxInitials and splitWith', () => {
      render(<Avatar name="john.ronald.reuel.tolkien" splitWith="." maxInitials={3} />);
      expect(screen.getByRole('img')).toHaveTextContent('JRR');
    });

    it('renders the default fallback for a blank name without role or label', () => {
      const { container } = render(<Avatar name="  " />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveTextContent('?');
      expect(root).not.toHaveAttribute('role');
      expect(root).not.toHaveAttribute('aria-label');
    });

    it('renders a custom fallback node', () => {
      render(<Avatar fallback={<svg data-testid="icon" />} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('prefers a consumer aria-label', () => {
      render(<Avatar name="Jane" aria-label="Profile picture" />);
      expect(screen.getByRole('img', { name: 'Profile picture' })).toHaveTextContent('J');
    });
  });

  describe('styling', () => {
    it('applies size as width, height and font size', () => {
      render(<Avatar name="A" size={60} />);
      expect(screen.getByRole('img')).toHaveStyle({
        width: '60px',
        height: '60px',
        fontSize: '24px',
      });
    });

    it('is round by default', () => {
      render(<Avatar name="A" />);
      expect(screen.getByRole('img')).toHaveStyle({ borderRadius: '50%' });
    });

    it('supports legacy height/width/borderRadius (numbers are px)', () => {
      render(<Avatar name="A" size={40} height={50} width={70} borderRadius={8} />);
      expect(screen.getByRole('img')).toHaveStyle({
        width: '70px',
        height: '50px',
        borderRadius: '8px',
      });
    });

    it('auto-picks a stable palette background with white text', () => {
      const { rerender } = render(<Avatar name="Ada Lovelace" />);
      const expected = pickColor('Ada Lovelace');
      expect(screen.getByRole('img')).toHaveStyle({ backgroundColor: expected, color: '#ffffff' });
      rerender(<Avatar name="Ada Lovelace" />);
      expect(screen.getByRole('img')).toHaveStyle({ backgroundColor: expected });
    });

    it('seeds the auto color from initials when name is empty', () => {
      const { container } = render(<Avatar initials="XY" />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveTextContent('XY');
      expect(root).not.toHaveAttribute('role');
      expect(root).toHaveStyle({ backgroundColor: pickColor('XY') });
    });

    it('uses explicit colors and a custom palette', () => {
      const { rerender } = render(<Avatar name="A" backgroundColor="#ffffff" color="#123456" />);
      expect(screen.getByRole('img')).toHaveStyle({ backgroundColor: '#ffffff', color: '#123456' });
      rerender(<Avatar name="A" colors={['#123456']} />);
      expect(screen.getByRole('img')).toHaveStyle({ backgroundColor: '#123456' });
    });

    it('picks dark text on a light explicit background', () => {
      render(<Avatar name="A" backgroundColor="#FFF" />);
      expect(screen.getByRole('img')).toHaveStyle({ color: '#111827' });
    });

    it('adds a solid border', () => {
      render(<Avatar name="A" borderWidth={2} borderColor="#000000" />);
      expect(screen.getByRole('img')).toHaveStyle({
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#000000',
      });
    });

    it('appends className after the base class and lets style override', () => {
      render(<Avatar name="A" className="custom" style={{ fontWeight: 400 }} />);
      const root = screen.getByRole('img');
      expect(root.className).toBe('react-initial-avatar custom');
      expect(root).toHaveStyle({ fontWeight: '400' });
    });
  });

  describe('DOM passthrough', () => {
    it('passes span attributes through and forwards the ref', () => {
      const onClick = vi.fn();
      const ref = createRef<HTMLSpanElement>();
      render(<Avatar name="A" title="Hello" data-testid="av" onClick={onClick} ref={ref} />);
      const root = screen.getByTestId('av');
      expect(root).toHaveAttribute('title', 'Hello');
      fireEvent.click(root);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(ref.current).toBe(root);
    });

    it('renders on the server without touching the DOM', () => {
      const html = renderToString(<Avatar name="Server Side" />);
      expect(html).toContain('SS');
      expect(html).toContain('react-initial-avatar');
      expect(html).toContain('role="img"');
    });
  });

  describe('image', () => {
    it('renders an img with alt defaulting to name and keeps the wrapper unlabelled', () => {
      render(<Avatar name="Jane Doe" src="https://example.com/a.png" />);
      const img = screen.getByRole('img', { name: 'Jane Doe' });
      expect(img.tagName).toBe('IMG');
      expect(img).toHaveAttribute('src', 'https://example.com/a.png');
      expect(img).toHaveClass('react-initial-avatar__img');
      expect(img.parentElement).toHaveClass('react-initial-avatar');
      expect(img.parentElement).not.toHaveAttribute('role');
      expect(img.parentElement).not.toHaveAttribute('aria-label');
    });

    it('uses alt when provided', () => {
      render(<Avatar name="Jane Doe" src="https://example.com/a.png" alt="Jane's photo" />);
      expect(screen.getByRole('img', { name: "Jane's photo" }).tagName).toBe('IMG');
    });

    it('treats an empty src as no image', () => {
      render(<Avatar name="Jane Doe" src="" />);
      expect(screen.getByRole('img', { name: 'Jane Doe' }).tagName).toBe('SPAN');
      expect(document.querySelector('img')).toBeNull();
    });

    it('falls back to initials when the image fails and retries a new src', () => {
      const { rerender } = render(<Avatar name="Jane Doe" src="https://example.com/bad.png" />);
      fireEvent.error(screen.getByRole('img'));
      const fallback = screen.getByRole('img', { name: 'Jane Doe' });
      expect(fallback.tagName).toBe('SPAN');
      expect(fallback).toHaveTextContent('JD');
      expect(document.querySelector('img')).toBeNull();

      rerender(<Avatar name="Jane Doe" src="https://example.com/good.png" />);
      expect(screen.getByRole('img').tagName).toBe('IMG');

      rerender(<Avatar name="Jane Doe" src="https://example.com/bad.png" />);
      expect(screen.getByRole('img').tagName).toBe('SPAN');
    });
  });
});

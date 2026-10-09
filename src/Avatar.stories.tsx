import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Avatar } from './index';

const meta = {
  title: 'Avatar',
  component: Avatar,
  args: {
    name: 'Elizabeth Smith Brown',
  },
  argTypes: {
    size: { control: 'number' },
    round: { control: 'boolean' },
    maxInitials: { control: 'number' },
    textSizeRatio: { control: 'number' },
    borderWidth: { control: 'number' },
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
    borderColor: { control: 'color' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Linus Torvalds',
  'Margaret Hamilton',
  'Dennis Ritchie',
  'Barbara Liskov',
  'Ken Thompson',
  'Radia Perlman',
  'Alan Turing',
  'Hedy Lamarr',
  'Tim Berners-Lee',
  'Katherine Johnson',
];

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', maxWidth: 560 }}>
    {children}
  </div>
);

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      {[24, 32, 40, 56, 80, '6rem'].map((size) => (
        <Avatar key={String(size)} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Row>
      <Avatar {...args} round />
      <Avatar {...args} round={false} />
      <Avatar {...args} round={8} />
      <Avatar {...args} round="30%" />
    </Row>
  ),
};

export const Palette: Story = {
  render: () => (
    <Row>
      {NAMES.map((name) => (
        <Avatar key={name} name={name} size={48} title={name} />
      ))}
    </Row>
  ),
};

export const CustomPalette: Story = {
  render: () => (
    <Row>
      {NAMES.map((name) => (
        <Avatar key={name} name={name} size={48} colors={['#0f172a', '#1e293b', '#334155']} />
      ))}
    </Row>
  ),
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=47',
    size: 64,
  },
};

export const BrokenImageFallback: Story = {
  args: {
    src: 'https://example.invalid/missing.png',
    size: 64,
  },
};

export const Borders: Story = {
  render: (args) => (
    <Row>
      <Avatar {...args} borderWidth={2} />
      <Avatar
        {...args}
        borderWidth={3}
        borderColor="#fff"
        style={{ boxShadow: '0 0 0 2px #4F46E5' }}
      />
      <Avatar {...args} round={8} borderWidth="0.25em" borderColor="#111827" />
    </Row>
  ),
};

export const CustomInitials: Story = {
  args: {
    initials: 'EB',
  },
};

export const EmptyName: Story = {
  args: {
    name: '',
  },
};

export const Legacy1xProps: Story = {
  name: 'Legacy 1.x props',
  args: {
    name: 'Jane Smith',
    height: 30,
    width: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f0f8ff',
    color: '#6495ed',
  },
};

export const Playground: Story = {
  args: {
    name: 'Ada Lovelace',
    size: 64,
    round: true,
    maxInitials: 2,
    textSizeRatio: 2.5,
    borderWidth: 0,
  },
};

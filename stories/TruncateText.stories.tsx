import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TruncateText from '../src/TruncateText.tsx';

const meta: Meta = {
  title: 'TruncateText',
  component: TruncateText,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type Story = StoryObj<typeof TruncateText>;

export const Pri: Story = {
  args: {
    children:
      'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello\nWorld Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World ',
    maxLine: 2,
    ellipsisText: '...더보기',
  },
};

// export const Primary: Story = args => <Thing {...args} />;
// const Template: Story<Props> = args => <Thing {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
// export const Default = Template.bind({});
//
// Default.args = {};
